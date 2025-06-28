import { ApolloClient } from '@apollo/client';
import { CREATE_COURSE_MUTATION, CREATE_CHAPTER_MUTATION } from '@/graphql/mutations/course-mutations';
import { CourseFormState, VideoMetadata, CourseCreationResult } from '../types';

export class CourseService {
  private client: ApolloClient<any>;

  constructor(apolloClient: ApolloClient<any>) {
    this.client = apolloClient;
  }

  async createCourse(formData: CourseFormState, videoMetadata?: VideoMetadata): Promise<CourseCreationResult> {
    try {
      // Create the course
      const { data: courseData } = await this.client.mutate({
        mutation: CREATE_COURSE_MUTATION,
        variables: {
          title: formData.title,
          description: formData.description || '',
          price: 0 // Default price
        },
      });

      if (!courseData?.createCourse?.course?.id) {
        throw new Error(courseData?.createCourse?.error || 'Failed to create course');
      }

      const courseId = courseData.createCourse.course.id;
      const videoId = videoMetadata?.id;
      const createdChapters = [];

      // Create chapters if any
      if (formData.chapters.length > 0) {
        for (let i = 0; i < formData.chapters.length; i++) {
          const chapter = formData.chapters[i];
          const order = i;
          const chapterVideoId = i === 0 ? videoId : null; // Associate video only with first chapter
          
          const { data } = await this.client.mutate({
            mutation: CREATE_CHAPTER_MUTATION,
            variables: {
              title: chapter.title,
              order,
              courseId,
              videoId: chapterVideoId
            }
          });
          
          if (data?.createChapter?.chapter) {
            createdChapters.push({
              id: data.createChapter.chapter.id,
              title: chapter.title
            });
          }
        }
      } else if (videoId) {
        // If we have a video but no chapters, create a default chapter
        const { data } = await this.client.mutate({
          mutation: CREATE_CHAPTER_MUTATION,
          variables: {
            title: 'Introduction',
            order: 0,
            courseId,
            videoId
          }
        });
        
        if (data?.createChapter?.chapter) {
          createdChapters.push({
            id: data.createChapter.chapter.id,
            title: 'Introduction'
          });
        }
      }

      return {
        courseId,
        videoId,
        chapters: createdChapters
      };
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }
}

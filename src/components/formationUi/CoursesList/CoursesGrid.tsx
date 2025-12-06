import type { Course } from "@/types/course";
import CourseCard from "../CourseCard";

interface CoursesGridProps {
  courses: Course[];
}

export function CoursesGrid({ courses }: CoursesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="h-full">
          <CourseCard formation={course} />
        </div>
      ))}
    </div>
  );
}

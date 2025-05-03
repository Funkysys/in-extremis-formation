export type CardType = {
  id: string;
  title: string;
  description: string;
  link?: string;
  imageUrl?: string;
  mail?: string;
};

export type VideoData = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

export type CourseCardProps = {
  temp_video_data: VideoData[];
};

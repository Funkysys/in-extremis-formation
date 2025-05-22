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




export interface Role {

  id: string;

  name: string;

  description: string;

}



export interface User {

  id: string;

  email: string;

  fullName: string;

  roles: Role[];

}

export type CartItem = {
  id: string;
  course_id: string;
  quantity: number;
  title?: string;
  imageUrl?: string;
  price?: number;
};
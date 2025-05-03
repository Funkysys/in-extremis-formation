import { CourseCardProps, VideoData } from "@/types";
import Image from "next/image";

const CourseCard = ({ temp_video_data }: CourseCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 w-[80%] ">
      {temp_video_data.map((video: VideoData) => (
        <div
          key={video.id}
          className="card bg-sky-100 lg:min-h-[50vh] shadow-sm"
        >
          <figure className="card h-72 md:h-80 lg:h-96 xl:h-full w-full overflow-hidden">
            <Image src={video.imageUrl} alt={video.title} fill />
          </figure>
          <div className="card-body ">
            <h2 className="card-title text-slate-800">{video.title}</h2>
            <p className="text-sm text-slate-600">
              {video.description.length > 100
                ? `${video.description.slice(0, 100)}...`
                : video.description}
            </p>
            <div className="card-actions justify-end">
              <button className="btn bg-yellow-300 hover:bg-yellow-400">{`Voir +`}</button>
              <button className="btn btn-primary">{`Acheter l'atelier`}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCard;

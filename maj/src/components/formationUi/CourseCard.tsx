import temp_video_data from "@/data/temp_video";
import { VideoData } from "@/types";
import Image from "next/image";

const CourseCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 w-[80%] ">
      {temp_video_data.map((video: VideoData) => (
        <div
          key={video.id}
          className="card bg-sky-100 lg:min-h-[40vh] shadow-sm"
        >
          <figure className="card h-72 md:h-80 lg:h-96 xl:h-full w-full overflow-hidden">
            <Image src={video.imageUrl} alt={video.title} fill />
            <button className="btn absolute right-2 bottom-2 text-slate-800 bg-yellow-300 hover:bg-yellow-400 border-none">{`Voir +`}</button>
          </figure>
          <div className="h-full w-full flex p-2">
            <div className="h-full w-[68%] flex flex-col items-center p-4 ">
              <h2 className="card-title text-slate-800 bg">{video.title}</h2>
              <p className="text-sm text-slate-600">
                {video.description.length > 100
                  ? `${video.description.slice(0, 100)}...`
                  : video.description}
              </p>
            </div>
            <div className="card-actions h-full w-[32%] flex flex-col items-end justify-end ">
              <button className="btn w-full text-slate-800 bg-yellow-300 hover:bg-yellow-400 border-none">{`+ liste de souhait`}</button>
              <button className="btn w-full btn-primary ">{`Ajouter au panier`}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCard;

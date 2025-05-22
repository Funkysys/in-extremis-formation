import Image from "next/image";
import Link from "next/link";



interface CourseCardProps {
  formation: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
  };
  isOwner?: boolean;
}

const CourseCard = ({ formation, isOwner }: CourseCardProps) => {
  if (!formation) {
    return (
      <div className="h-[90vh] w-[90vw] shadow-sm flex items-center justify-center">
        <div className="text-slate-300">{'Pas de formation pour le moment'}</div>
      </div>
    );
  }
  return (
    <div className="card bg-sky-100 lg:min-h-[40vh] shadow-sm">
      <figure className="card h-72 md:h-80 lg:h-96 xl:h-full w-full overflow-hidden">
        {formation.imageUrl ? (
          <Image src={formation.imageUrl} alt={formation.title} fill />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-200 text-slate-500">
            Pas d'image
          </div>
        )}
        <Link href={`/formation/${formation.title}`}>
          <button className="btn absolute right-2 bottom-2 text-slate-800 bg-yellow-300 hover:bg-yellow-400 border-none">Voir +</button>
        </Link>
      </figure>
      <div className="h-full w-full flex p-2">
        <div className="h-full w-[68%] flex flex-col  p-4 ">
          <h2 className="card-title text-slate-800 ">{formation.title}</h2>
          <p className="text-sm text-slate-600">
            {formation.description.length > 100
              ? `${formation.description.slice(0, 100)}...`
              : formation.description}
          </p>
        </div>
        <div className="card-actions h-full w-[32%] flex flex-col items-end justify-end ">
          <button className="btn w-full text-slate-800 bg-yellow-300 hover:bg-yellow-400 border-none">+ liste de souhait</button>
          <button className="btn w-full btn-primary ">Ajouter au panier</button>
          {isOwner && (
            <div className="flex flex-col gap-2 w-full">
              <button className="btn w-full bg-amber-600 hover:bg-amber-700 text-white">Mettre à jour</button>
              <button className="btn w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => alert('Fonction de suppression à implémenter')}>Supprimer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

import Image from "next/image";
import Link from "next/link";

import { Course } from "@/types/course";

interface CourseCardProps {
  formation: Course;
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
      <figure className="card h-72 md:h-80 lg:h-96 xl:h-full w-full overflow-hidden relative">
        {formation.image?.url ? (
          <Image 
            src={formation.image.url} 
            alt={formation.image.altText || formation.title} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : formation.coverImage?.url ? (
          <Image 
            src={formation.coverImage.url} 
            alt={formation.coverImage.altText || formation.title} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-800 to-slate-600 text-slate-300">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-sm">Aucune miniature disponible</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <Link href={`/formation/${formation.id}`} className="absolute right-2 bottom-2">
            <button className="btn text-slate-800 bg-yellow-300 hover:bg-yellow-400 border-none">
              Voir +
            </button>
          </Link>
        </div>
      </figure>
      <div className="h-full w-full flex p-2">
        <div className="h-full w-[68%] flex flex-col  p-4 ">
          <h2 className="card-title text-slate-800 line-clamp-1">{formation.title}</h2>
          <p className="text-sm text-slate-600 line-clamp-2">
            {formation.description || 'Aucune description disponible'}
          </p>
          {formation.price !== undefined && formation.price > 0 && (
            <div className="mt-2">
              <span className="text-lg font-bold text-slate-800">{formation.price.toFixed(2)} €</span>
            </div>
          )}
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

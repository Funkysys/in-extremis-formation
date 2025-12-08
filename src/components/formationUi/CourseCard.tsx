import { LikeButton } from "@/components/likes";
import { AddToPlaylistButton } from "@/components/playlists";
import { ShareButton } from "@/components/share";
import { COURSES_QUERY } from "@/graphql/queries";
import { usePerformanceTracking, usePrefetchOnHover } from "@/hooks/utils";
import Image from "next/image";
import Link from "next/link";

import { Course } from "@/types/course";

interface CourseCardProps {
  formation: Course;
  isOwner?: boolean;
}

const CourseCard = ({ formation, isOwner }: CourseCardProps) => {
  // Performance tracking
  usePerformanceTracking({
    componentName: `CourseCard-${formation.id}`,
    trackRender: true,
    trackMount: false,
    warnThreshold: 10,
  });

  // Prefetch course details au hover
  const prefetchProps = usePrefetchOnHover({
    query: COURSES_QUERY,
    variables: { id: formation.id },
  });
  if (!formation) {
    return (
      <div className="h-[90vh] w-[90vw] shadow-sm flex items-center justify-center">
        <div className="text-slate-300">
          {"Pas de formation pour le moment"}
        </div>
      </div>
    );
  }
  return (
    <div className="card bg-sky-100 lg:min-h-[40vh] shadow-sm">
      <figure className="relative w-full overflow-hidden card h-72 md:h-80 lg:h-96 xl:h-full">
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
            <div className="p-4 text-center">
              <div className="mb-2 text-4xl">🎬</div>
              <p className="text-sm">Aucune miniature disponible</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute top-2 right-2 flex gap-2">
            <AddToPlaylistButton
              courseId={formation.id}
              courseTitle={formation.title}
              size="md"
            />
            <ShareButton
              courseId={formation.id}
              courseTitle={formation.title}
              courseDescription={formation.description}
              size="md"
            />
            <LikeButton
              courseId={formation.id}
              initialLiked={false}
              initialCount={0}
              size="md"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
            />
          </div>
          <Link
            href={`/formation/${formation.id}`}
            className="absolute right-2 bottom-2"
            {...prefetchProps}
          >
            <button className="bg-yellow-300 border-none btn text-slate-800 hover:bg-yellow-400">
              Voir +
            </button>
          </Link>
        </div>
      </figure>
      <div className="flex w-full h-full p-2">
        <div className="h-full w-[68%] flex flex-col  p-4 ">
          <h2 className="card-title text-slate-800 line-clamp-1">
            {formation.title}
          </h2>
          <p className="text-sm text-slate-600 line-clamp-2">
            {formation.description || "Aucune description disponible"}
          </p>
          {formation.price !== undefined && formation.price > 0 && (
            <div className="mt-2">
              <span className="text-lg font-bold text-slate-800">
                {formation.price.toFixed(2)} €
              </span>
            </div>
          )}
        </div>
        <div className="card-actions h-full w-[32%] flex flex-col items-end justify-end ">
          <button className="w-full bg-yellow-300 border-none btn text-slate-800 hover:bg-yellow-400">
            + liste de souhait
          </button>
          <button className="w-full btn btn-primary ">Ajouter au panier</button>
          {isOwner && (
            <div className="flex flex-col w-full gap-2">
              <button className="w-full text-white btn bg-amber-600 hover:bg-amber-700">
                Mettre à jour
              </button>
              <button
                className="w-full text-white bg-red-600 btn hover:bg-red-700"
                onClick={() => alert("Fonction de suppression à implémenter")}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

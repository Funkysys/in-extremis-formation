"use client";

import EditCourseInfoModal from "@/components/formateur/EditCourseInfoModal";
import VideoChaptersModal from "@/components/formateur/VideoChaptersModal";
import { VideoUploadZone } from "@/components/formateur/VideoUploadZone";
import { UPDATE_COURSE_MUTATION } from "@/graphql/mutations/course-mutations";
import { COURSE_BY_TITLE_QUERY } from "@/graphql/queries/course-queries";
import { useVideoUpload } from "@/hooks/video";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number | null;
  published: boolean;
  created_at: string;
  cover_image?: {
    url: string;
  };
  chapters?: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
  }>;
  videos?: Video[];
}

export default function EditCoursePage() {
  const { title } = useParams();
  const { data, loading, error, refetch } = useQuery(COURSE_BY_TITLE_QUERY, {
    variables: { title },
    skip: !title,
  });

  const course = data?.courseByTitle as Course | undefined;
  const [modalOpen, setModalOpen] = useState(false);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const lastVideoRef = useRef<HTMLLIElement | null>(null);
  const [updateCourse] = useMutation(UPDATE_COURSE_MUTATION);

  // Utilisation du hook personnalisé pour l'upload de vidéos
  const { upload, isUploading, uploadProgress } = useVideoUpload({
    onSuccess: () => {
      // Faire défiler vers la nouvelle vidéo après l'upload
      setTimeout(() => {
        lastVideoRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);

      // Rafraîchir les données du cours
      refetch();
    },
    onError: (error) => {
      console.error("Erreur lors de l'upload:", error);
    },
    maxSizeMB: 100, // 100MB max
  });

  // Liste des vidéos (depuis le cours ou l'état local)
  const videos = course?.videos || [];

  // Gestion de la suppression d'une vidéo
  const handleDeleteVideo = useCallback(async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) {
      return;
    }

    try {
      // TODO: Implémenter la suppression via mutation GraphQL
      // await deleteVideoMutation({ variables: { id: videoId } });
      await refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression de la vidéo:", error);
    }
  }, [refetch]);

  // Gestion de la sauvegarde des modifications du cours
  const handleSaveCourse = useCallback(
    async (updated: Partial<Course>) => {
      if (!course) return;

      try {
        await updateCourse({
          variables: {
            id: course.id,
            ...updated,
          },
        });

        setModalOpen(false);
        await refetch();
      } catch {
        console.error("Erreur lors de la mise à jour du cours:");
        // Optionnel : afficher une erreur à l'utilisateur ici
      }
    },
    [course, refetch, updateCourse]
  );

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error)
    return <div className="p-8 text-red-500">Erreur : {error.message}</div>;
  if (!course) return <div className="p-8">Cours introuvable.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Modifier les informations
            </button>
            <Link
              href="/formateur/mes-formations"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Retour à la liste
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Description du cours</h2>
          <p className="text-gray-700">
            {course.description || "Aucune description fournie."}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Prix:</span>
              <p className="text-lg font-semibold">
                {course.price ? `${course.price} €` : "Gratuit"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Statut:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.published
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {course.published ? "Publié" : "Brouillon"}
              </span>
            </div>
          </div>
        </div>

        {/* Zone de dépôt de vidéo */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Contenu vidéo
          </h3>
          <VideoUploadZone
            onUpload={upload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            maxSizeMB={100}
            className="bg-gray-50 p-6 rounded-lg border border-gray-200"
          />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vidéos du cours
          </h3>

          {videos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <h4 className="mt-2 text-sm font-medium text-gray-700">
                Aucune vidéo
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par ajouter votre première vidéo
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {videos.map((video, index) => (
                <li
                  key={video.id}
                  ref={index === videos.length - 1 ? lastVideoRef : null}
                  className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {video.title}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>
                            Ajouté le{" "}
                            {new Date(video.createdAt).toLocaleDateString()}
                          </span>
                          {video.duration && (
                            <>
                              <span className="mx-2">•</span>
                              <span>
                                {Math.floor(video.duration / 60)}:
                                {(video.duration % 60)
                                  .toString()
                                  .padStart(2, "0")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedVideo(video);
                            setChapterModalOpen(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Gérer les chapitres
                        </button>
                        <button
                          onClick={() => handleDeleteVideo()}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>

                    {video.thumbnailUrl && (
                      <div className="mt-3">
                        <div className="relative pt-[56.25%] bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={video.thumbnailUrl}
                            alt={`Miniature de ${video.title}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            layout="fill"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedVideo && (
        <VideoChaptersModal
          video={selectedVideo}
          isOpen={chapterModalOpen}
          onClose={() => setChapterModalOpen(false)}
        />
      )}

      <EditCourseInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        course={course}
        onSave={handleSaveCourse}
      />
    </div>
  );
}

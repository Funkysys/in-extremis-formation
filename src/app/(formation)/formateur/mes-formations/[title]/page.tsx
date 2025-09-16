"use client";
import EditCourseInfoModal from "@/components/formateur/EditCourseInfoModal";
import VideoChaptersModal from "@/components/formateur/VideoChaptersModal";
import { VideoUploadZone } from "@/components/formateur/VideoUploadZone";
import { UPDATE_COURSE_MUTATION } from "@/graphql/mutations/course-mutations";
import { COURSE_BY_TITLE_QUERY } from "@/graphql/queries/course-queries";
import { useVideoUpload } from "@/hooks/useVideoUpload";
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

function EditCoursePage() {
  const { title } = useParams();
  const { data, loading, error, refetch } = useQuery(COURSE_BY_TITLE_QUERY, {
    variables: { title },
    skip: !title,
  });

  const course = data?.courseByTitle as Course | undefined;
  const [modalOpen, setModalOpen] = useState(false);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
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
    onError: () => {
      console.error("Erreur lors de l'upload:");
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
      // await deleteVideoMutation();
      await refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression de la vidéo:", error);
    }
  }, [refetch]);

  // Gestion de la sauvegarde des modifications du cours
  const handleSaveCourse = useCallback(
    async (updated: Partial<Course>) => {
      if (!course) return;

      setSaving(true);
      setSaveError(null);

      try {
        await updateCourse({
          variables: {
            id: course.id,
            ...updated,
          },
        });

        setModalOpen(false);
        await refetch();
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error("Erreur lors de la mise à jour du cours:", e);
          setSaveError(e.message || "Une erreur est survenue");
        } else {
          setSaveError("Une erreur est survenue");
        }
      } finally {
        setSaving(false);
      }
    },
    [course, refetch, updateCourse]
  );

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error)
    return <div className="p-8 text-red-500">Erreur : {error.message}</div>;
  if (!course) return <div className="p-8">Cours introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-4 p-2 sm:p-4 md:p-6 bg-white rounded shadow text-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Édition de la formation : {course.title}
        </h1>
        <Link href="/formateur/mes-formations" className="btn btn-secondary">
          Retour
        </Link>
      </div>
      <div className="mb-6">
        <Image
          src={course.cover_image?.url || "/placeholder.jpg"}
          alt="cover"
          className="rounded max-h-48 mb-2"
          width={400}
          height={192}
        />
        <div className="flex flex-col gap-1">
          <span>
            <b>Description :</b> {course.description}
          </span>
          <span>
            <b>Prix :</b> {course.price ? course.price + " €" : "-"}
          </span>
          <span>
            <b>Statut :</b> {course.published ? "Publié" : "Brouillon"}
          </span>
          <span>
            <b>Créé le :</b> {new Date(course.created_at).toLocaleDateString()}
          </span>
        </div>
        <button
          className="btn btn-outline btn-sm mt-2"
          onClick={() => setModalOpen(true)}
        >
          Modifier les infos du cours
        </button>
        <EditCourseInfoModal
          course={course}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCourse}
        />
        {saving && <div className="text-blue-600 mt-2">Enregistrement...</div>}
        {saveError && (
          <div className="text-red-500 mt-2">Erreur : {saveError}</div>
        )}
      </div>
      <hr className="my-6" />
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Chapitres</h2>
          <button className="btn btn-success btn-sm">
            Ajouter un chapitre
          </button>
        </div>
        {course.chapters?.length ? (
          <ul className="space-y-2">
            {course.chapters.map(
              (ch: {
                id: string;
                title: string;
                description: string;
                order: number;
              }) => (
                <li
                  key={ch.id}
                  className="p-3 bg-sky-50 rounded flex justify-between items-center"
                >
                  <div>
                    <b>{ch.title}</b>{" "}
                    <span className="text-xs text-slate-500">
                      (ordre : {ch.order})
                    </span>
                    <br />
                    <span>{ch.description}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-xs btn-info">Modifier</button>
                    <button className="btn btn-xs btn-error">Supprimer</button>
                  </div>
                </li>
              )
            )}
          </ul>
        ) : (
          <div className="text-slate-500">Aucun chapitre pour ce cours.</div>
        )}
      </div>
      <hr className="my-6" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vidéos</h2>
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
                          onClick={handleDeleteVideo}
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
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedVideo && (
          <VideoChaptersModal
            video={selectedVideo}
            isOpen={chapterModalOpen}
            onClose={() => setChapterModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default EditCoursePage;

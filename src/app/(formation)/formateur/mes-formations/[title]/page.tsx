"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { COURSE_BY_TITLE_QUERY } from "@/graphql/queries/course-queries";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import EditCourseInfoModal from "@/components/formateur/EditCourseInfoModal";
import AddVideoModal from "@/components/formateur/AddVideoModal";
import VideoChaptersModal from "@/components/formateur/VideoChaptersModal";
import { DELETE_BUNNY_VIDEO_MUTATION } from "@/graphql/mutations/video-mutations";
import { useToast } from "@/providers/ToastProvider";
import { useMutation } from "@apollo/client";
import { UPDATE_COURSE_MUTATION } from "@/graphql/mutations/course-mutations";

export default function EditCoursePage() {
  const { title } = useParams();
  const { data, loading, error, refetch } = useQuery(COURSE_BY_TITLE_QUERY, {
    variables: { title },
  });
  const course = data?.courseByTitle;

  const [modalOpen, setModalOpen] = useState(false);
  const [addVideoOpen, setAddVideoOpen] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const lastVideoRef = useRef<HTMLLIElement | null>(null);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [updateCourse] = useMutation(UPDATE_COURSE_MUTATION);
  const [deleteVideo, { loading: deletingVideo }] = useMutation(DELETE_BUNNY_VIDEO_MUTATION);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string|null>(null);
  const { showToast } = useToast();

  const handleVideoAdded = (video: any) => {
    setVideos(v => [...v, video]);
    setTimeout(() => {
      lastVideoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    refetch(); // Pour rafraîchir la liste réelle si besoin
  };

  const handleSaveCourse = async (updated: any) => {
    setSaving(true);
    setSaveError(null);
    try {
      // TODO: gérer l'upload d'image si coverImage est un fichier
      await updateCourse({
        variables: {
          id: course.id,
          title: updated.title,
          description: updated.description,
          price: updated.price,
          published: updated.published,
          // cover_image_id: ...
        },
      });
      setModalOpen(false);
      refetch();
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">Erreur : {error.message}</div>;
  if (!course) return <div className="p-8">Cours introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-4 p-2 sm:p-4 md:p-6 bg-white rounded shadow text-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Édition de la formation : {course.title}</h1>
        <Link href="/formateur/mes-formations" className="btn btn-secondary">Retour</Link>
      </div>
      <div className="mb-6">
        <img src={course.cover_image?.url || "/placeholder.jpg"} alt="cover" className="rounded max-h-48 mb-2" />
        <div className="flex flex-col gap-1">
          <span><b>Description :</b> {course.description}</span>
          <span><b>Prix :</b> {course.price ? course.price + " €" : "-"}</span>
          <span><b>Statut :</b> {course.published ? "Publié" : "Brouillon"}</span>
          <span><b>Créé le :</b> {new Date(course.created_at).toLocaleDateString()}</span>
        </div>
        <button className="btn btn-outline btn-sm mt-2" onClick={() => setModalOpen(true)}>
          Modifier les infos du cours
        </button>
        <EditCourseInfoModal
          course={course}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCourse}
        />
        {saving && <div className="text-blue-600 mt-2">Enregistrement...</div>}
        {saveError && <div className="text-red-500 mt-2">Erreur : {saveError}</div>}
      </div>
      <hr className="my-6" />
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Chapitres</h2>
          <button className="btn btn-success btn-sm">Ajouter un chapitre</button>
        </div>
        {course.chapters?.length ? (
          <ul className="space-y-2">
            {course.chapters.map((ch: any) => (
              <li key={ch.id} className="p-3 bg-sky-50 rounded flex justify-between items-center">
                <div>
                  <b>{ch.title}</b> <span className="text-xs text-slate-500">(ordre : {ch.order})</span><br />
                  <span>{ch.description}</span>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-xs btn-info">Modifier</button>
                  <button className="btn btn-xs btn-error">Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-slate-500">Aucun chapitre pour ce cours.</div>
        )}
      </div>
      <hr className="my-6" />
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Vidéos</h2>
          <button className="btn btn-success btn-sm" onClick={() => setAddVideoOpen(true)}>Ajouter une vidéo</button>
        </div>
        <AddVideoModal isOpen={addVideoOpen} onClose={() => setAddVideoOpen(false)} onVideoAdded={handleVideoAdded} />
        {(course.videos?.length || videos.length) ? (
          <ul className="space-y-2">
            {[...(course.videos || []), ...videos].map((v: any, idx, arr) => (
              <li
                key={v.guid || v.id}
                ref={idx === arr.length - 1 ? lastVideoRef : null}
                className="p-2 sm:p-3 bg-sky-50 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.01] opacity-100"
              >
                <div className="flex-1 min-w-0">
                  <b className="block truncate text-base sm:text-lg">{v.title}</b> <span className="text-xs text-slate-500">(durée : {v.duration || v.length || "-"})</span><br />
                  <span className="block text-xs sm:text-sm truncate">{v.description}</span>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  <button className="btn btn-xs btn-info">Modifier</button>
                  <button className="btn btn-xs btn-warning" onClick={() => { setSelectedVideo(v); setChapterModalOpen(true); }}>Chapitrer</button>
                  <button className="btn btn-xs btn-error" disabled={deletingVideo} onClick={async () => {
                    if (!window.confirm("Confirmer la suppression de cette vidéo ?")) return;
                    try {
                      await deleteVideo({ variables: { guid: v.guid || v.id } });
                      refetch();
                      showToast("Vidéo supprimée avec succès", "success");
                    } catch (e) {
                      showToast("Erreur lors de la suppression de la vidéo", "error");
                    }
                  }}>{deletingVideo ? "..." : "Supprimer"}</button>
                </div>
              </li>
            ))}

          </ul>
        ) : (
          <div className="text-slate-500">Aucune vidéo pour ce cours.</div>
        )}
      </div>
      <VideoChaptersModal
        video={selectedVideo}
        isOpen={chapterModalOpen}
        onClose={() => setChapterModalOpen(false)}
      />
    </div>
  );
}

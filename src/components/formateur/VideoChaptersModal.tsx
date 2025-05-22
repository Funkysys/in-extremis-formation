"use client";
import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { VIDEO_MARKERS_BY_VIDEO_QUERY } from "@/graphql/queries/video-queries";
import { CREATE_VIDEO_MARKER_MUTATION, DELETE_VIDEO_MARKER_MUTATION } from "@/graphql/mutations/video-mutations";
import { useToast } from "@/providers/ToastProvider";

interface VideoChaptersModalProps {
  video: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoChaptersModal({ video, isOpen, onClose }: VideoChaptersModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterDesc, setChapterDesc] = useState("");
  const [timestamp, setTimestamp] = useState<number>(0);
  const { data, loading, error, refetch } = useQuery(VIDEO_MARKERS_BY_VIDEO_QUERY, {
    variables: { videoId: video.guid || video.id },
    skip: !video,
  });
  const [addMarker] = useMutation(CREATE_VIDEO_MARKER_MUTATION);
  const [deleteMarker] = useMutation(DELETE_VIDEO_MARKER_MUTATION);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string|null>(null);
  const { showToast } = useToast();
  const lastChapterRef = useRef<HTMLLIElement | null>(null);

  if (!isOpen) return null;

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await addMarker({
        variables: {
          videoId: video.guid || video.id,
          title: chapterTitle,
          description: chapterDesc,
          timestamp: timestamp,
        },
      });
      await refetch();
      setTimeout(() => {
        lastChapterRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
      setChapterTitle("");
      setChapterDesc("");
      showToast("Chapitre ajouté avec succès", "success");
    } catch (e: any) {
      setSaveError(e.message);
      showToast("Erreur lors de l'ajout du chapitre", "error");
    } finally {
      setSaving(false);
    }
  };


  const handleSetTimestamp = () => {
    if (videoRef.current) {
      setTimestamp(videoRef.current.currentTime);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-2 sm:p-6 md:p-8 max-w-full sm:max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 btn btn-sm btn-circle">✕</button>
        <h2 className="text-xl font-bold mb-4">Chapitrer la vidéo : {video.title}</h2>
        <video
          ref={videoRef}
          src={video.direct_play_url || video.url}
          controls
          className="w-full max-h-64 mb-4 rounded shadow"
        />
        <form onSubmit={handleAddChapter} className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-outline btn-sm" onClick={handleSetTimestamp}>
              Récupérer le temps actuel
            </button>
            <span className="text-sm">Timestamp : {Math.floor(timestamp/60)}:{(Math.floor(timestamp)%60).toString().padStart(2,'0')}</span>
          </div>
          <div>
            <label className="block mb-1">Titre du chapitre</label>
            <input className="input input-bordered w-full" value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Description (optionnel)</label>
            <input className="input input-bordered w-full" value={chapterDesc} onChange={e => setChapterDesc(e.target.value)} />
          </div>
          <button className="btn btn-primary w-full mt-2" type="submit" disabled={saving}>Ajouter le chapitre</button>
          {saveError && <div className="text-red-500 mt-2">Erreur : {saveError}</div>}
        </form>
        <h3 className="text-lg font-semibold mb-2">Chapitres existants</h3>
        {loading ? (
          <div>Chargement…</div>
        ) : error ? (
          <div className="text-red-500">Erreur : {error.message}</div>
        ) : (
          <ul className="space-y-2">
            {data?.videoMarkers?.map((m: any, idx, arr) => (
              <li
                key={m.id}
                ref={idx === arr.length - 1 ? lastChapterRef : null}
                className="p-1 sm:p-2 bg-sky-50 rounded flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 transition-all duration-300 ease-in-out hover:shadow hover:scale-[1.01] opacity-100"
              >
                <span className="font-bold text-xs sm:text-base">{m.title}</span>
                <span className="text-xs text-slate-500">{Math.floor(m.timestamp/60)}:{(Math.floor(m.timestamp)%60).toString().padStart(2,'0')}</span>
                <span className="text-xs sm:text-sm">{m.description}</span>
                <button className="btn btn-xs btn-error ml-0 sm:ml-2 mt-1 sm:mt-0" onClick={async () => {
                  if (!window.confirm("Confirmer la suppression de ce chapitre ?")) return;
                  try {
                    await deleteMarker({ variables: { id: m.id }});
                    await refetch();
                    showToast("Chapitre supprimé avec succès", "success");
                  } catch (e) {
                    showToast("Erreur lors de la suppression du chapitre", "error");
                  }
                }}>Supprimer</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

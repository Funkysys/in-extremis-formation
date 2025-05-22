"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BUNNY_VIDEO_MUTATION } from "@/graphql/mutations/video-mutations";

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoAdded: (video: any) => void;
}

export default function AddVideoModal({ isOpen, onClose, onVideoAdded }: AddVideoModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createVideo] = useMutation(CREATE_BUNNY_VIDEO_MUTATION);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    try {
      // Ici, on suppose que l'API backend accepte le fichier via une mutation GraphQL
      // ou bien il faut d'abord uploader le fichier et ensuite créer la ressource vidéo.
      // Ici on envoie juste les infos de base, à adapter selon ton backend !
      const { data } = await createVideo({
        variables: {
          input: {
            title,
            description,
            // TODO: gérer l'upload réel du fichier vidéo si besoin
            // file: file, // à activer si mutation accepte un fichier
          },
        },
      });
      onVideoAdded(data.create_bunny_video);
      setTitle("");
      setDescription("");
      setFile(null);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 btn btn-sm btn-circle">✕</button>
        <h2 className="text-xl font-bold mb-4">Ajouter une vidéo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Titre</label>
            <input className="input input-bordered w-full" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea className="textarea textarea-bordered w-full" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Vidéo</label>
            <input type="file" accept="video/*" className="file-input w-full" onChange={e => setFile(e.target.files?.[0] || null)} required />
          </div>
          <button className="btn btn-primary w-full mt-2" type="submit" disabled={uploading}>{uploading ? "Upload..." : "Ajouter la vidéo"}</button>
          {error && <div className="text-red-500 mt-2">Erreur : {error}</div>}
        </form>
      </div>
    </div>
  );
}

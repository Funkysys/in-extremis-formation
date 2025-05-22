"use client";
import React, { useState } from "react";

interface EditCourseInfoModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: any) => void;
}

export default function EditCourseInfoModal({ course, isOpen, onClose, onSave }: EditCourseInfoModalProps) {
  const [title, setTitle] = useState(course.title || "");
  const [description, setDescription] = useState(course.description || "");
  const [price, setPrice] = useState(course.price ? String(course.price) : "");
  const [published, setPublished] = useState(!!course.published);
  const [coverImage, setCoverImage] = useState<File|null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string|null>(course.cover_image?.url || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 btn btn-sm btn-circle">✕</button>
        <h2 className="text-xl font-bold mb-4">Modifier les infos du cours</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({ title, description, price: parseFloat(price), published, coverImage });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1">Titre</label>
            <input className="input input-bordered w-full" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea className="textarea textarea-bordered w-full" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Prix (€)</label>
            <input className="input input-bordered w-full" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Image de couverture</label>
            <input type="file" accept="image/*" className="file-input w-full" onChange={e => {
              const file = e.target.files?.[0] || null;
              setCoverImage(file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setCoverImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              } else {
                setCoverImagePreview(course.cover_image?.url || null);
              }
            }} />
            {coverImagePreview && <img src={coverImagePreview} alt="Aperçu" className="mt-2 max-h-32 rounded shadow" />}
          </div>
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="checkbox checkbox-primary" />
            <label htmlFor="published" className="cursor-pointer select-none">Publier la formation</label>
          </div>
          <button className="btn btn-primary w-full mt-2" type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  );
}

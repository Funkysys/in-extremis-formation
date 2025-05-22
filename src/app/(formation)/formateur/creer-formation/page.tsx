"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_COURSE_MUTATION } from "@/graphql/mutations/course-mutations";
import { uploadVideoMultipart } from "@/lib/uploadVideo";

export default function CreerFormationPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File|null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string|null>(null);
  const [videoFile, setVideoFile] = useState<File|null>(null);
  const [videoUrl, setVideoUrl] = useState<string|null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadVideoError, setUploadVideoError] = useState<string|null>(null);
  const [formError, setFormError] = useState<string|null>(null);
  const [createCourse, { loading, error }] = useMutation(CREATE_COURSE_MUTATION);
  
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    setVideoUrl(null);
    setUploadVideoError(null);
    if (file) {
      setUploadingVideo(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
        
        let uploadTitle = title.trim() || file.name.replace(/\.[^/.]+$/, "");
        console.log("Titre utilisé pour l'upload:", uploadTitle);
        
        console.log("Début de l'upload avec:", {
          endpoint: process.env.NEXT_PUBLIC_API_URL + "/graphql",
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          title: uploadTitle
        });
        
        const result = await uploadVideoMultipart({
          endpoint: process.env.NEXT_PUBLIC_API_URL + "/graphql",
          file,
          title: uploadTitle,
          token: token || undefined,
        });
        
        console.log("Résultat complet de l'upload:", result);
        
        if (result?.data?.uploadVideo?.video) {
          console.log("Vidéo reçue:", result.data.uploadVideo.video);
        } else {
          console.log("Pas de vidéo dans la réponse");
        }
        
        const url = result?.data?.uploadVideo?.video?.url || null;
        console.log("URL extraite:", url);
        
        setVideoUrl(url);
        setUploadingVideo(false);
        
        if (result?.data?.uploadVideo?.error) {
          console.log("Erreur d'upload détectée:", result.data.uploadVideo.error);
          setUploadVideoError(result.data.uploadVideo.error);
        }
      } catch (err: any) {
        setUploadVideoError(err.message || "Erreur lors de l'upload vidéo");
        setUploadingVideo(false);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (videoFile && (!videoUrl || uploadingVideo)) {
      setFormError("Veuillez attendre la fin de l'upload vidéo avant de valider la formation.");
      return;
    }
    let coverImageId = null;
    if (coverImage) {
      alert('L\'upload d\'image n\'est pas encore implémenté.');
    }
    try {
      await createCourse({
        variables: {
          title,
          description,
          published,
          price: parseFloat(price),
          // cover_image_id: coverImageId, // Uncomment if backend expects this
          video_url: videoUrl, // Adapter selon le schéma backend
        },
      });
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setPublished(false);
      setCoverImage(null);
      setCoverImagePreview(null);
      setVideoFile(null);
      setVideoUrl(null);
      router.push("/formateur/mes-formations");
    } catch (err: any) {
      setFormError(err.message || "Erreur lors de la création de la formation");
    }
  };


  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-sky-100 rounded shadow text-slate-800">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle formation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Image de couverture</label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={e => {
              const file = e.target.files?.[0] || null;
              setCoverImage(file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setCoverImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              } else {
                setCoverImagePreview(null);
              }
            }}
          />
          {coverImagePreview && (
            <img src={coverImagePreview} alt="Aperçu" className="mt-2 max-h-40 rounded shadow" />
          )}
        </div>
        <div>
          <label className="block mb-1">Vidéo de la formation</label>
          <input
            type="file"
            accept="video/*"
            className="file-input file-input-bordered w-full"
            onChange={handleVideoChange}
          />
          {uploadingVideo && <div className="text-blue-600 mt-2">Upload vidéo en cours...</div>}
          {uploadVideoError && <div className="text-red-600 mt-2">{uploadVideoError}</div>}
          {videoUrl && (
            <div className="mt-2">
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Voir la vidéo sur PeerTube</a>
              <video src={videoUrl} controls className="mt-2 max-h-40" />
            </div>
          )}
        </div>
        <div>
          <label className="block mb-1">Titre</label>
          <input
            className="input input-bordered w-full text-slate-200"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="textarea textarea-bordered w-full text-slate-200"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Prix (€)</label>
          <input
            className="input input-bordered w-full text-slate-200"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
            className="checkbox checkbox-primary"
          />
          <label htmlFor="published" className="cursor-pointer select-none">Publier la formation (visible par les apprenants)</label>
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={loading || uploadingVideo}>
          {loading ? "Création..." : uploadingVideo ? "Upload vidéo en cours..." : "Créer la formation"}
        </button>
        {formError && <div className="text-red-600 mt-2">{formError}</div>}
        {error && <div className="text-red-500 mt-2">Erreur : {error.message}</div>}
      </form>
    </div>
  );
}

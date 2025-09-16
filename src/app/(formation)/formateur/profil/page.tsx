"use client";
import {
  SET_TRAINER_TOPICS,
  UPDATE_TRAINER,
} from "@/graphql/mutations/trainer-mutations";
import { UPDATE_USER_MUTATION } from "@/graphql/mutations/user-mutations";
import { GET_ALL_TOPICS } from "@/graphql/queries/topic-queries";
import { GET_TRAINER, USER_QUERY } from "@/graphql/queries/trainer-queries";
import { ME_QUERY } from "@/graphql/queries/user-queries";
import { useToast } from "@/providers/ToastProvider";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { DELETE_USER_MUTATION } from "@/graphql/mutations/user-mutations";
import { useRouter } from "next/navigation";

export default function ProfilFormateurPage() {
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER_MUTATION);

  const { showToast } = useToast();
  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
  const userId = meData?.me?.id;
  const { data: userData, loading: userLoading } = useQuery(USER_QUERY, {
    variables: { id: userId },
    skip: !userId,
  });
  const { data: topicsData, loading: topicsLoading } = useQuery(GET_ALL_TOPICS);
  const {
    data: trainerData,
    loading: trainerLoading,
    refetch,
  } = useQuery(GET_TRAINER, { variables: { id: userId }, skip: !userId });
  const [updateTrainer, { loading: updating }] = useMutation(UPDATE_TRAINER);
  const [setTrainerTopics, { loading: updatingTopics }] =
    useMutation(SET_TRAINER_TOPICS);
  const [updateUser, { loading: updatingUser }] =
    useMutation(UPDATE_USER_MUTATION);

  const user = userData?.user;
  const trainer = trainerData?.trainer;
  const allTopics = topicsData?.topics || [];

  useEffect(() => {
    if (user) setFullName(user.fullName || "");
    if (trainer) {
      setDescription(trainer.description || "");
      setSelectedTopics(trainer.topics?.map((t: any) => t.id) || []);
    }
  }, [user, trainer]);

  if (meLoading || userLoading || topicsLoading || trainerLoading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user && fullName.trim() && fullName !== user.fullName) {
        await updateUser({
          variables: { userId: user.id, data: { fullName } },
        });
      }
      await updateTrainer({
        variables: { trainerId: trainer.id, description },
      });
      await setTrainerTopics({
        variables: { trainerId: trainer.id, topicIds: selectedTopics },
      });
      showToast("Profil mis à jour !", "success");
      refetch();
    } catch {
      showToast("Erreur lors de la mise à jour", "error");
    }
    setSaving(false);
  };

  const handleTopicChange = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      showToast("Compte supprimé avec succès !", "success");
      localStorage.removeItem("token");
      setShowConfirm(false);
      router.replace("/");
    } catch (error) {
      showToast("Erreur lors de la suppression du compte", "error");
      setShowConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">
        Mon profil formateur
      </h1>
      <form className="space-y-6" onSubmit={handleSave}>
        <div>
          <label className="block text-slate-700 font-medium mb-1">
            Nom complet
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="input input-bordered w-full bg-slate-100"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1">
            Description
          </label>
          <textarea
            className="textarea textarea-bordered w-full min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décris-toi en quelques mots..."
          />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-2">
            {"Mots-clés pour te retrouver"}
          </label>
          <div className="flex flex-wrap gap-3">
            {allTopics.map((topic: any) => (
              <label
                key={topic.id}
                className={`px-3 py-1 rounded-full border cursor-pointer flex items-center gap-2 ${
                  selectedTopics.includes(topic.id)
                    ? "bg-amber-700 text-white border-amber-700"
                    : "bg-white border-slate-300 text-slate-800"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.id)}
                  onChange={() => handleTopicChange(topic.id)}
                  className="mr-1 accent-amber-700"
                />
                {topic.name}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full mt-4 flex items-center gap-2"
          disabled={saving || updatingUser || updating || updatingTopics}
        >
          {saving || updatingUser || updating || updatingTopics ? (
            <span className="inline-block animate-spin rounded-full border-2 border-white border-t-transparent h-5 w-5 mr-2 align-middle"></span>
          ) : null}
          {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
        </button>
      </form>
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="btn btn-outline btn-error font-semibold"
          onClick={() => setShowConfirm(true)}
        >
          Supprimer mon compte
        </button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 text-slate-800">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-red-700">
              Confirmer la suppression
            </h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est{" "}
              <span className="font-bold text-red-600">irréversible</span>.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                className="btn btn-error font-semibold"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Suppression..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

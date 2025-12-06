"use client";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ProfileFormFields } from "./ProfileFormFields";
import { TopicsSelector } from "./TopicsSelector";
import { useTrainerProfile } from "./useTrainerProfile";

export default function ProfilFormateurPage() {
  const {
    fullName,
    setFullName,
    description,
    setDescription,
    selectedTopics,
    saving,
    showConfirm,
    setShowConfirm,
    email,
    allTopics,
    updatingUser,
    updating,
    updatingTopics,
    deleting,
    handleSave,
    handleTopicChange,
    handleDelete,
    loading,
  } = useTrainerProfile();

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">
        Mon profil formateur
      </h1>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <ProfileFormFields
          fullName={fullName}
          email={email}
          description={description}
          onFullNameChange={setFullName}
          onDescriptionChange={setDescription}
        />
        <TopicsSelector
          allTopics={allTopics}
          selectedTopics={selectedTopics}
          onTopicChange={handleTopicChange}
        />
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
      <DeleteConfirmModal
        isOpen={showConfirm}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

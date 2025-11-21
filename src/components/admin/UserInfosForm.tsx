"use client";

import { useUserProfileForm } from "@/hooks/admin/useUserProfileForm";
import { DeleteConfirmation } from "./shared/DeleteConfirmation";
import { ErrorDisplay } from "./shared/ErrorDisplay";
import { ProfileFormFields } from "./shared/ProfileFormFields";

interface UserInfosFormProps {
  onDeleted?: () => void;
}

export default function UserInfosForm({ onDeleted }: UserInfosFormProps) {
  const {
    form,
    data,
    loading,
    error,
    updating,
    deleting,
    formError,
    phoneError,
    showConfirm,
    tokenExpired,
    isNotAuthenticated,
    setShowConfirm,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useUserProfileForm(onDeleted);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-slate-100 font-roboto border-b border-slate-200">
          Chargement...
        </h1>
      </div>
    );
  }

  if (tokenExpired || isNotAuthenticated) return null;

  if (!data?.me) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-slate-100 font-roboto border-b border-slate-200">
          Aucun utilisateur connecté
        </h1>
      </div>
    );
  }

  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-slate-100 font-roboto border-b border-slate-200">
        Mes informations
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <ProfileFormFields
          form={form}
          email={data.me.email}
          formError={formError}
          phoneError={phoneError}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          disabled={updating}
        >
          Sauvegarder
        </button>
      </form>
      <button
        type="button"
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
        onClick={() => setShowConfirm(true)}
        disabled={!data?.me?.id || deleting}
      >
        Supprimer mon compte
      </button>
      <DeleteConfirmation
        show={showConfirm}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

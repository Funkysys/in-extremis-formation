"use client";

import { LIST_PAYMENTS_QUERY } from "@/graphql/queries/paymentQueries";
import { ME_QUERY } from "@/graphql/queries/userQueries";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { PaymentHistory } from "./PaymentHistory";
import { ProfileDisplay } from "./ProfileDisplay";
import { ProfileForm } from "./ProfileForm";
import { useProfileEdit } from "./useProfileEdit";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const { user: authUser } = useAuth();

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(ME_QUERY);

  const {
    data: paymentsData,
    loading: paymentsLoading,
    error: paymentsError,
  } = useQuery(LIST_PAYMENTS_QUERY);

  const {
    isEditing,
    formData,
    updating,
    handleChange,
    handleSubmit,
    handleCancel,
    startEditing,
  } = useProfileEdit(userData?.me || null);

  useEffect(() => {
    if (!authUser) {
      window.location.href = "/auth";
    }
  }, [authUser]);

  if (userLoading) return <p>Chargement...</p>;
  if (userError) return <p>Erreur: {userError.message}</p>;

  const user = userData?.me || {};
  const payments = paymentsData?.listPayments || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Informations personnelles</h2>
          {!isEditing && (
            <button
              onClick={startEditing}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Modifier
            </button>
          )}
        </div>

        {isEditing ? (
          <ProfileForm
            formData={formData}
            currentEmail={user.email || ""}
            updating={updating}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <ProfileDisplay user={user} />
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Historique des paiements
        </h2>
        {paymentsError ? (
          <p className="text-red-500">Erreur: {paymentsError.message}</p>
        ) : (
          <PaymentHistory payments={payments} loading={paymentsLoading} />
        )}
      </div>
    </div>
  );
}

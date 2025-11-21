"use client";

import { UPDATE_MY_PROFILE_MUTATION } from "@/graphql/mutations";
import { LIST_PAYMENTS_QUERY, ME_QUERY } from "@/graphql/queries";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated, refetchUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
  });

  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
  const { data: paymentsData, loading: paymentsLoading } =
    useQuery(LIST_PAYMENTS_QUERY);

  const [updateProfile, { loading: updating }] = useMutation(
    UPDATE_MY_PROFILE_MUTATION,
    {
      onCompleted: async () => {
        setIsEditing(false);
        await refetchUser();
      },
      onError: (error) => {
        console.error("Erreur lors de la mise à jour du profil:", error);
        alert("Erreur lors de la mise à jour du profil");
      },
    }
  );

  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  if (meLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = meData?.me || user;
  const payments = paymentsData?.list_payments || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateProfile({
      variables: {
        input: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Détails du profil</h2>
          {!isEditing && (
            <button
              onClick={() => {
                setFormData({
                  fullName: currentUser?.fullName || "",
                  email: currentUser?.email || "",
                  phone: currentUser?.phone || "",
                  address: currentUser?.address || "",
                  city: currentUser?.city || "",
                  zipCode: currentUser?.zipCode || "",
                  country: currentUser?.country || "",
                });
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Modifier
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (non modifiable)
              </label>
              <input
                type="email"
                value={currentUser?.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {updating ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <p>
              <strong>Nom:</strong> {currentUser?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {currentUser?.email}
            </p>
            <p>
              <strong>Téléphone:</strong>{" "}
              {currentUser?.phone || "Non renseigné"}
            </p>
            <p>
              <strong>Adresse:</strong>{" "}
              {currentUser?.address || "Non renseignée"}
            </p>
            <p>
              <strong>Ville:</strong> {currentUser?.city || "Non renseignée"}
            </p>
            <p>
              <strong>Code postal:</strong>{" "}
              {currentUser?.zipCode || "Non renseigné"}
            </p>
            <p>
              <strong>Pays:</strong> {currentUser?.country || "Non renseigné"}
            </p>
            {currentUser?.roles && currentUser.roles.length > 0 && (
              <p>
                <strong>Rôles:</strong>{" "}
                {currentUser.roles.map((r) => r.name).join(", ")}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Historique des paiements</h3>
        {paymentsLoading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-500">Aucun paiement pour le moment</p>
        ) : (
          <ul className="space-y-3">
            {payments.map((payment: { id: string; description: string; amount: number; status: string; createdAt: string }) => (
              <li key={payment.id} className="border-b pb-3">
                <div className="flex justify-between">
                  <span>
                    <strong>{payment.description}</strong>
                  </span>
                  <span className="text-green-600 font-semibold">
                    {payment.amount} €
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span>Méthode: {payment.method}</span> •
                  <span> Statut: {payment.status}</span> •
                  <span>
                    {" "}
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

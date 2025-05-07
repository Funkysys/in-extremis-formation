"use client";
import { useQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { ME_QUERY } from "@/graphql/queries/user-queries";
import { UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from "@/graphql/mutations/user-mutations";

interface UserInfosFormProps {
  onDeleted?: () => void;
}

export default function UserInfosForm({ onDeleted }: UserInfosFormProps) {
  const { data, loading, error, refetch } = useQuery(ME_QUERY);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER_MUTATION);
  const [form, setForm] = useState({
    fullName: "",
    // Ajoutez ici d'autres champs à éditer si besoin
  });
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (data?.me) {
      setForm({
        fullName: data.me.fullName || "",
        // Ajoutez ici d'autres champs à éditer si besoin
      });
    }
  }, [data]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement du profil</div>;
  if (!data?.me) return <div>Aucun utilisateur connecté</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      variables: {
        userId: data.me.id,
        data: { fullName: form.fullName }, // Ajoutez ici d'autres champs
      },
    });
    refetch();
  };

  const handleDelete = async () => {
    await deleteUser();
    if (onDeleted) onDeleted();
    window.location.href = "/logout";
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Mes informations</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={data.me.email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Nom complet</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {/* Ajoutez d'autres champs éditables ici */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={updating}
        >
          Sauvegarder
        </button>
      </form>
      <div className="mt-8">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => setShowConfirm(true)}
          disabled={deleting}
        >
          Supprimer mon compte
        </button>
        {showConfirm && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
            <div className="flex gap-4 mt-2">
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={handleDelete} disabled={deleting}>
                Oui, supprimer
              </button>
              <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowConfirm(false)}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

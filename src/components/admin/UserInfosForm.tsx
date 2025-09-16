"use client";
import {
  DELETE_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from "@/graphql/mutations/user-mutations";
import { ME_QUERY } from "@/graphql/queries/user-queries";
import { useToast } from "@/providers/ToastProvider";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UserInfosFormProps {
  onDeleted?: () => void;
}

export default function UserInfosForm({ onDeleted }: UserInfosFormProps) {
  const { showToast } = useToast();
  const { data, loading, error, refetch } = useQuery(ME_QUERY);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER_MUTATION);
  const [form, setForm] = useState({
    fullName: "",
    zipCode: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const francophoneCountries = [
    { code: "FR", name: "France" },
    { code: "BE", name: "Belgique" },
    { code: "CH", name: "Suisse" },
    { code: "CA", name: "Canada" },
    { code: "LU", name: "Luxembourg" },
    { code: "SN", name: "Sénégal" },
    { code: "CI", name: "Côte d'Ivoire" },
    { code: "MA", name: "Maroc" },
    { code: "TN", name: "Tunisie" },
    { code: "DZ", name: "Algérie" },
  ];

  const isValidPhone = (value: string): boolean => {
    return /^([+]?\d{1,3}[-.\s]?)?(\d{6,15})$/.test(value.replace(/\s/g, ""));
  };

  const router = useRouter();

  type MinimalGraphQLError = {
    message: string;
    extensions?: { code?: string };
  };

  const tokenExpired = error?.graphQLErrors?.some(
    (err: MinimalGraphQLError) => err.extensions?.code === "TOKEN_EXPIRED"
  );
  const isNotAuthenticated = error?.graphQLErrors?.some(
    (err: MinimalGraphQLError) =>
      typeof err.message === "string" &&
      err.message.toLowerCase().includes("user is not authenticated")
  );

  useEffect(() => {
    if (data?.me) {
      setForm({
        fullName: data.me.fullName || "",
        zipCode: data.me.zipCode || "",
        phone: data.me.phone || "",
        address: data.me.address || "",
        city: data.me.city || "",
        country: data.me.country || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (tokenExpired || isNotAuthenticated) {
      router.replace("/formation");
    }
  }, [tokenExpired, isNotAuthenticated, router]);

  if (loading)
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-slate-100 font-roboto border-b border-slate-200">
          Chargement...
        </h1>
      </div>
    );

  if (tokenExpired || isNotAuthenticated) return null;

  if (!data?.me)
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-slate-100 font-roboto border-b border-slate-200">
          Aucun utilisateur connecté
        </h1>
      </div>
    );

  if (error) {
    let errorMsg = "Erreur lors du chargement du profil.";
    if (error.networkError) {
      errorMsg = `Erreur réseau : ${error.networkError.message}`;
    } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMsg = error.graphQLErrors
        .map((e: MinimalGraphQLError) => e.message)
        .join(" | ");
    } else if (error.message) {
      errorMsg = error.message;
    }
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-slate-100 mx-2 flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-red-600 font-roboto text-center">
            Erreur
          </h1>
          <div className="mb-6 text-base md:text-lg text-red-700 text-center">
            {errorMsg}
          </div>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold text-center"
          >{`Retour à l'accueil`}</Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError("");
    setPhoneError("");
    if (!form.fullName.trim()) {
      setFormError("Le nom complet est obligatoire.");
      return;
    }
    if (form.phone && !isValidPhone(form.phone)) {
      setPhoneError(
        "Numéro de téléphone invalide (format international attendu)."
      );
      return;
    }
    try {
      await updateUser({
        variables: {
          userId: data.me.id,
          data: {
            fullName: form.fullName,
            zipCode: form.zipCode,
            phone: form.phone,
            address: form.address,
            city: form.city,
            country: form.country,
          },
        },
      });
      showToast("Informations mises à jour !", "success");
      refetch();
    } catch {
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const handleDelete = async () => {
    if (!data?.me?.id) {
      console.error("Suppression impossible : id utilisateur absent", data?.me);
      showToast(
        "Impossible de supprimer le compte : identifiant utilisateur introuvable.",
        "error"
      );
      return;
    }
    try {
      await deleteUser({ variables: { userId: data.me.id } });
      showToast("Compte supprimé avec succès !", "success");
      setShowConfirm(false);
      if (onDeleted) onDeleted();
      router.replace("/formation");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("Erreur lors de la suppression du compte.", "error");
      }
      setShowConfirm(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-slate-100 font-roboto border-b border-slate-200">
        Mes informations
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
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
          <label className="block mb-1 font-semibold">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          {formError && (
            <div className="text-error text-sm mt-1">{formError}</div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Code postal</label>
          <input
            type="text"
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="ex: +33612345678"
          />
          {phoneError && (
            <div className="text-error text-sm mt-1">{phoneError}</div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Adresse</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Ville</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Pays</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Sélectionner un pays</option>
            {francophoneCountries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
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
      {showConfirm && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p>
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
            irréversible.
          </p>
          <div className="flex gap-4 mt-2">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={handleDelete}
              disabled={deleting}
            >
              Oui, supprimer
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => setShowConfirm(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

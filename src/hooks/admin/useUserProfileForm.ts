// Hook: useUserProfileForm - Gestion du formulaire de profil

import {
  DELETE_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from "@/graphql/mutations/user-mutations";
import { ME_QUERY } from "@/graphql/queries/user-queries";
import { useToast } from "@/providers/ToastProvider";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FormData {
  fullName: string;
  zipCode: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export const useUserProfileForm = (onDeleted?: () => void) => {
  const { showToast } = useToast();
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(ME_QUERY);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER_MUTATION);

  const [form, setForm] = useState<FormData>({
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

  const isValidPhone = (value: string): boolean => {
    return /^([+]?\d{1,3}[-.\s]?)?(\d{6,15})$/.test(value.replace(/\s/g, ""));
  };

  const tokenExpired = error?.graphQLErrors?.some(
    (err: any) => err.extensions?.code === "TOKEN_EXPIRED"
  );

  const isNotAuthenticated = error?.graphQLErrors?.some(
    (err: any) =>
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

  return {
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
  };
};

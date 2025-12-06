import { UPDATE_MY_PROFILE_MUTATION } from "@/graphql/mutations/user-mutations";
import { ToastService } from "@/services/toastService";
import { useMutation } from "@apollo/client";
import { useState } from "react";

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface User {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}

export function useProfileEdit(user: User | null) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
  });

  const [updateProfile, { loading: updating }] = useMutation(
    UPDATE_MY_PROFILE_MUTATION,
    {
      onCompleted: () => {
        ToastService.success("Profil mis à jour avec succès");
        setIsEditing(false);
      },
      onError: (error) => {
        ToastService.error(`Erreur: ${error.message}`);
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
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

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      zipCode: user?.zipCode || "",
      country: user?.country || "",
    });
    setIsEditing(false);
  };

  const startEditing = () => setIsEditing(true);

  return {
    isEditing,
    formData,
    updating,
    handleChange,
    handleSubmit,
    handleCancel,
    startEditing,
  };
}

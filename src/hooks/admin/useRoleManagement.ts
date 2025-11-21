// Hook: useRoleManagement - Gestion des rôles utilisateurs

import { CREATE_TRAINER } from "@/graphql/mutations/trainer-mutations";
import { UPDATE_USER_ROLES_MUTATION } from "@/graphql/mutations/user-mutations";
import type { Role, User } from "@/types";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const USERS_QUERY = gql`
  query {
    users {
      id
      email
      fullName
      roles {
        name
      }
    }
  }
`;

const ROLES_QUERY = gql`
  query {
    roles {
      id
      name
      description
    }
  }
`;

export const useRoleManagement = () => {
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(USERS_QUERY);
  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
  } = useQuery(ROLES_QUERY);
  const [updateUserRoles] = useMutation(UPDATE_USER_ROLES_MUTATION);
  const [createTrainer] = useMutation(CREATE_TRAINER);

  const [selectedRoles, setSelectedRoles] = useState<Record<string, string[]>>(
    {}
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const users: User[] = usersData?.users || [];
  const roles: Role[] = rolesData?.roles || [];

  const handleSave = async (userId: string) => {
    setSaving(userId);
    setError(null);
    setSuccess(null);

    try {
      const prevRoles =
        users.find((u) => u.id === userId)?.roles?.map((r) => r.name) || [];
      const nextRoles = selectedRoles[userId] || prevRoles;
      const wasTrainer =
        prevRoles.includes("formateur") || prevRoles.includes("admin");
      const willBeTrainer =
        nextRoles.includes("formateur") || nextRoles.includes("admin");

      await updateUserRoles({ variables: { userId, roles: nextRoles } });

      if (!wasTrainer && willBeTrainer) {
        await createTrainer({ variables: { userId } });
      }

      setSaving(null);
      setSuccess("Rôles mis à jour avec succès !");
      setTimeout(() => setSuccess(null), 1800);
    } catch {
      setError("Erreur lors de la mise à jour des rôles.");
      setSaving(null);
    }
  };

  return {
    users,
    roles,
    loading: usersLoading || rolesLoading,
    error: usersError || rolesError,
    selectedRoles,
    saving,
    errorMsg: error,
    successMsg: success,
    setSelectedRoles,
    setError,
    setSuccess,
    handleSave,
  };
};

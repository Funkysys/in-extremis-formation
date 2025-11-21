// Hook pour la gestion des utilisateurs

import {
  DELETE_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from "@/graphql/mutations/user-mutations";
import { USERS_QUERY } from "@/graphql/queries/user-queries";
import { QUERY_LIMITS } from "@/lib/admin/constants";
import { AdminUser, FilterStatus } from "@/lib/admin/types";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

export const useUsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const { data, loading, refetch } = useQuery(USERS_QUERY, {
    variables: { limit: QUERY_LIMITS.default, offset: QUERY_LIMITS.offset },
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => refetch(),
  });

  const users: AdminUser[] = data?.users || [];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && u.isActive) ||
      (filterStatus === "inactive" && !u.isActive) ||
      (filterStatus === "premium" && u.is_premium);

    return matchesSearch && matchesFilter;
  });

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir ${
          currentStatus ? "désactiver" : "activer"
        } cet utilisateur ?`
      )
    ) {
      await updateUser({
        variables: {
          id: parseInt(userId),
          input: { isActive: !currentStatus },
        },
      });
    }
  };

  const handleTogglePremium = async (
    userId: string,
    currentStatus: boolean
  ) => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir ${
          currentStatus ? "retirer" : "activer"
        } le statut premium ?`
      )
    ) {
      await updateUser({
        variables: {
          id: parseInt(userId),
          input: { is_premium: !currentStatus },
        },
      });
    }
  };

  const handleToggleSuperuser = async (
    userId: string,
    currentStatus: boolean
  ) => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir ${
          currentStatus ? "retirer" : "donner"
        } les droits admin ?`
      )
    ) {
      await updateUser({
        variables: {
          id: parseInt(userId),
          input: { isSuperuser: !currentStatus },
        },
      });
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ? Cette action est irréversible.`
      )
    ) {
      await deleteUser({
        variables: { userId: parseInt(userId) },
      });
    }
  };

  return {
    users,
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    handleToggleActive,
    handleTogglePremium,
    handleToggleSuperuser,
    handleDelete,
  };
};

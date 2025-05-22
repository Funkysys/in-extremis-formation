"use client";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { UPDATE_USER_ROLES_MUTATION } from "@/graphql/mutations/user-mutations";
import { CREATE_TRAINER } from "@/graphql/mutations/trainer-mutations";

import type { User, Role } from "@/types";

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


export default function RoleList() {
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(USERS_QUERY);
  const { data: rolesData, loading: rolesLoading, error: rolesError } = useQuery(ROLES_QUERY);
  const [updateUserRoles] = useMutation(UPDATE_USER_ROLES_MUTATION);
  const [createTrainer] = useMutation(CREATE_TRAINER);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (usersLoading || rolesLoading) return (
    <div className="flex items-center gap-2 text-slate-600"><span className="animate-spin text-2xl">⏳</span> Chargement...</div>
  );
  if (usersError || rolesError) return (
    <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded relative mb-4 flex items-center gap-2">
      <span className="text-lg">❌</span>
      <span>Erreur lors du chargement des données : {usersError?.message || rolesError?.message}</span>
    </div>
  );

  const users: User[] = usersData?.users || [];
  const roles: Role[] = rolesData?.roles || [];

  const handleSave = async (userId: string) => {
    setSaving(userId);
    setError(null);
    setSuccess(null);
    try {
      const prevRoles = users.find((u) => u.id === userId)?.roles?.map((r) => r.name) || [];
      const nextRoles = selectedRoles[userId] || prevRoles;
      const wasTrainer = prevRoles.includes("formateur") || prevRoles.includes("admin");
      const willBeTrainer = nextRoles.includes("formateur") || nextRoles.includes("admin");

      await updateUserRoles({
        variables: {
          userId,
          roles: nextRoles,
        },
      });

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

  const closeError = () => setError(null);
  const closeSuccess = () => setSuccess(null);

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded relative mb-4 flex items-center gap-2 animate-fade-in">
          <span className="text-lg">❌</span>
          <span>{error}</span>
          <button onClick={closeError} className="ml-auto text-red-700 hover:text-red-900 px-2 py-1 rounded focus:outline-none">✕</button>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded relative mb-4 flex items-center gap-2 animate-fade-in">
          <span className="text-lg">✅</span>
          <span>{success}</span>
          <button onClick={closeSuccess} className="ml-auto text-green-700 hover:text-green-900 px-2 py-1 rounded focus:outline-none">✕</button>
        </div>
      )}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Rôles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>
                <label className="block lg:sr-only font-semibold mb-1">Rôles</label>
                <div className={`flex flex-wrap gap-2 items-center min-h-[3rem] w-full border border-slate-300 rounded-lg bg-slate-50 px-2 py-2 ${saving === user.id ? 'opacity-60 pointer-events-none' : ''}`}>
                  
                  {(selectedRoles[user.id] || (user.roles ? user.roles.map((role) => role.name) : [])).length === 0 ? (
                    <span className="badge bg-slate-200 text-slate-500">Aucun rôle</span>
                  ) : (
                    (selectedRoles[user.id] || (user.roles ? user.roles.map((role) => role.name) : []))
                      .map((roleName: string) => (
                        <span
                          key={roleName}
                          className="flex items-center gap-1 badge bg-amber-200 text-amber-900 border border-amber-400 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {roleName}
                          {!(roleName === "admin" && (selectedRoles[user.id] || (user.roles ? user.roles.map((role) => role.name) : [])).includes("superadmin")) && (
                            <button
                              type="button"
                              className="ml-1 text-amber-900 hover:text-red-700 focus:outline-none"
                              aria-label={`Retirer le rôle ${roleName}`}
                              onClick={() => {
                                const next = (selectedRoles[user.id] || (user.roles ? user.roles.map((role) => role.name) : []))
                                  .filter((role: string) => role !== roleName);
                                setSelectedRoles((prev) => ({ ...prev, [user.id]: next }));
                              }}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))
                  )}
                  
                  <div className="relative">
                    <button
                      type="button"
                      className="ml-2 px-2 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                      tabIndex={0}
                      onClick={() => {
                        const dropdown = document.getElementById(`dropdown-roles-${user.id}`);
                        if (dropdown) dropdown.classList.toggle("hidden");
                      }}
                    >
                      + Ajouter
                    </button>
                    <div
                      id={`dropdown-roles-${user.id}`}
                      className="hidden absolute z-10 mt-1 left-0 w-32 bg-white border border-slate-300 rounded shadow-lg"
                    >
                      {roles.filter((role: Role) => !(selectedRoles[user.id] || (user.roles ? user.roles.map((role) => role.name) : [])).includes(role.name)).length === 0 ? (
                        <div className="px-2 py-1 text-slate-400 text-xs">Aucun rôle à ajouter</div>
                      ) : (
                        roles
                          .filter((role: Role) => !(selectedRoles[user.id] || (user.roles ? user.roles.map((role) => role.name) : [])).includes(role.name))
                          .map((role: Role) => (
                            <button
                              key={role.name}
                              type="button"
                              className="w-full text-left px-2 py-1 hover:bg-amber-100 text-xs text-amber-900"
                              onClick={() => {
                                let next = [...(selectedRoles[user.id] || (user.roles ? user.roles.map((role) => role.name) : [])), role.name];
                                if (role.name === "superadmin" && !next.includes("admin")) {
                                  next = [...next, "admin"];
                                }
                                setSelectedRoles(prev => ({ ...prev, [user.id]: next }));
                                const dropdown = document.getElementById(`dropdown-roles-${user.id}`);
                                if (dropdown) dropdown.classList.add("hidden");
                              }}
                            >
                              {role.name}
                            </button>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary flex items-center gap-2"
                  onClick={() => handleSave(user.id)}
                  disabled={saving === user.id}
                >
                  {saving === user.id ? (
                    <span className="flex items-center gap-1"><span className="animate-spin">⏳</span> Enregistrement...</span>
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

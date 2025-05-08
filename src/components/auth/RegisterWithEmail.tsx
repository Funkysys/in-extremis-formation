"use client";
import React, { useState } from "react";
import { useToaster } from "../formationUi/Toaster";
import { useMutation } from "@apollo/client";
import { CREATE_USER_MUTATION, LOGIN_MUTATION } from "@/graphql/mutations/user-mutations";

export default function RegisterWithEmail({ onSuccess }: { onSuccess: () => void }) {
  const { addToast } = useToaster();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);
  const [register, { loading }] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: async (data) => {
      setError("");
      if (data.createUser && data.createUser.user) {
        try {
          const loginResult = await login({ variables: { email, password } });
          const loginData = loginResult.data;
          if (loginData && loginData.login && loginData.login.token) {
            localStorage.setItem("token", loginData.login.token);
            setSuccess(true);
            addToast("Compte créé avec succès !", "success");
            onSuccess();
          } else {
            setError(loginData?.login?.error || "Erreur lors de la connexion automatique");
            setSuccess(false);
            addToast(loginData?.login?.error || "Erreur lors de la connexion automatique", "error");
          }
        } catch (loginErr: unknown) {
          if (loginErr instanceof Error) {
            setError(loginErr.message || "Erreur lors de la connexion automatique");
            addToast(loginErr.message || "Erreur lors de la connexion automatique", "error");
          } else {
            setError("Erreur lors de la connexion automatique");
            addToast("Erreur lors de la connexion automatique", "error");
          }
          setSuccess(false);
        }
      } else {
        setError(data.createUser?.error || "Erreur lors de l'inscription");
        setSuccess(false);
        addToast(data.createUser?.error || "Erreur lors de l'inscription", "error");
      }
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Le mot de passe doit contenir au moins un caractère spécial.");
      return;
    }
    register({ variables: { email, password, fullName } });
  };

  return (
    <form onSubmit={handleSubmit} className="form-control gap-2 w-full max-w-xs mx-auto">
      <input
        type="text"
        placeholder="Nom complet"
        className="input input-bordered"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="input input-bordered"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        className="input input-bordered"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-error text-sm mt-1">{error}</div>}
      {success && <div className="text-success text-sm mt-1">Inscription réussie !</div>}
      <button className="btn btn-primary mt-2" disabled={loading} type="submit">
        {loading ? "Inscription..." : "S'inscrire"}
      </button>
    </form>
  );
}

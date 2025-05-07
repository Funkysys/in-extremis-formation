"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphql/mutations/user-mutations";

export default function LoginWithEmail({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login.token) {
        // Stocke le token, gère l'auth ici (localStorage/cookie)
        localStorage.setItem("token", data.login.token);
        onSuccess();
      } else {
        setError(data.login.error || "Erreur inconnue");
      }
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login({ variables: { email, password } });
  };

  return (
    <form onSubmit={handleSubmit} className="form-control gap-2 w-full max-w-xs mx-auto">
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
      <button className="btn btn-primary mt-2" disabled={loading} type="submit">
        {loading ? "Connexion..." : "Se connecter"}
      </button>
      {error && <div className="text-error text-sm mt-1">{error}</div>}
    </form>
  );
}

"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REQUEST_MAGIC_LINK_MUTATION, VERIFY_MAGIC_LINK_MUTATION } from "@/graphql/mutations/user-mutations";

export default function LoginWithMagicLink({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [requestMagicLink, { loading }] = useMutation(REQUEST_MAGIC_LINK_MUTATION, {
    onCompleted: (data) => {
      if (data.requestMagicLink?.success) {
        setMessage("Lien magique envoyé ! Consulte ta boîte mail.");
      } else {
        setError(data.requestMagicLink?.error || "Erreur lors de l'envoi du lien magique.");
      }
    },
    onError: (err) => setError(err.message),
  });

  const [verifyMagicLink, { loading: loadingVerify }] = useMutation(VERIFY_MAGIC_LINK_MUTATION, {
    onCompleted: (data) => {
      if (data.verify_magic_link.token) {
        localStorage.setItem("token", data.verify_magic_link.token);
        onSuccess();
      } else {
        setError(data.verify_magic_link.error || "Lien invalide.");
      }
    },
    onError: (err) => setError(err.message),
  });

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    requestMagicLink({ variables: { email } });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    verifyMagicLink({ variables: { token } });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
      <form onSubmit={handleRequest} className="form-control gap-2">
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary mt-2" disabled={loading} type="submit">
          {loading ? "Envoi..." : "Recevoir un lien magique"}
        </button>
      </form>
      <form onSubmit={handleVerify} className="form-control gap-2">
        <input
          type="text"
          placeholder="Token reçu par mail"
          className="input input-bordered"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button className="btn btn-accent mt-2" disabled={loadingVerify} type="submit">
          {loadingVerify ? "Vérification..." : "Se connecter avec le token"}
        </button>
      </form>
      {message && <div className="text-success text-sm mt-1">{message}</div>}
      {error && <div className="text-error text-sm mt-1">{error}</div>}
    </div>
  );
}

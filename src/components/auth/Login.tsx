"use client";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    setLoggedIn(true);
    onSuccess?.();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!loggedIn && (
        <>
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Se connecter
          </button>
          <AuthModal open={open} onClose={() => setOpen(false)} onSuccess={handleSuccess} />
        </>
      )}
    </div>
  );
}

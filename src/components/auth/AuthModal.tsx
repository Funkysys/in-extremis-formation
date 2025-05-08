"use client";
import { useState, useRef, useEffect } from "react";
import LoginWithEmail from "./LoginWithEmail";
import LoginWithOAuth from "./LoginWithOAuth";
import LoginWithMagicLink from "./LoginWithMagicLink";
import RegisterWithEmail from "./RegisterWithEmail";
import RegisterWithOAuth from "./RegisterWithOAuth";
import RegisterWithMagicLink from "./RegisterWithMagicLink";
import "./auth-modal.css";

export default function AuthModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [tab, setTab] = useState<"email" | "oauth" | "magic">("email");
  const modalRef = useRef<HTMLDivElement>(null);

  // Animation Tailwind (opacity + scaleX)
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.classList.remove("animate-modalOut");
      modalRef.current.classList.add("animate-modalIn");
    } else if (!open && modalRef.current) {
      modalRef.current.classList.remove("animate-modalIn");
      modalRef.current.classList.add("animate-modalOut");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal modal-open text-slate-800">
      <div
        className="modal-box flex flex-col items-center justify-center p-8 rounded-xl shadow-xl max-w-2xl w-[520px] min-h-[420px] relative animate-none"
        ref={modalRef}
        style={{ transition: "box-shadow 0.2s" }}
      >
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10"
        >
          ✕
        </button>
        <div className="flex gap-8 mb-6 mt-2 w-full justify-center text-lg font-semibold select-none">
          <button
            className={`pb-1 transition-all border-b-2 ${mode === "login" ? "border-primary text-primary" : "border-transparent hover:border-slate-400 text-slate-400 hover:text-primary"}`}
            style={{ background: "none", boxShadow: "none" }}
            onClick={() => setMode("login")}
            type="button"
          >
            Se connecter
          </button>
          <button
            className={`pb-1 transition-all border-b-2 ${mode === "register" ? "border-primary text-primary" : "border-transparent hover:border-slate-400 text-slate-400 hover:text-primary"}`}
            style={{ background: "none", boxShadow: "none" }}
            onClick={() => setMode("register")}
            type="button"
          >
            S'inscrire
          </button>
        </div>
        <div className="flex gap-2 mb-4 justify-center w-full">
          <button
            className={`btn btn-sm flex-1 ${tab === "email" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab("email")}
            type="button"
          >
            Email
          </button>
          <button
            className={`btn btn-sm flex-1 ${tab === "oauth" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab("oauth")}
            type="button"
          >
            Google/Discord
          </button>
          <button
            className={`btn btn-sm flex-1 ${tab === "magic" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab("magic")}
            type="button"
          >
            Magic Link
          </button>
        </div>
        <div className="w-full flex-1">
          {mode === "login" && tab === "email" && <LoginWithEmail onSuccess={onSuccess} />}
          {mode === "login" && tab === "oauth" && <LoginWithOAuth onSuccess={onSuccess} />}
          {mode === "login" && tab === "magic" && <LoginWithMagicLink onSuccess={onSuccess} />}
          {mode === "register" && tab === "email" && <RegisterWithEmail onSuccess={onSuccess} />}
          {mode === "register" && tab === "oauth" && <RegisterWithOAuth onSuccess={onSuccess} />}
          {mode === "register" && tab === "magic" && <RegisterWithMagicLink onSuccess={onSuccess} />}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

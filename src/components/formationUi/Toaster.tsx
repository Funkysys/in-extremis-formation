"use client";
import { useEffect, useState } from "react";

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

let toastId = 0;

export function useToaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string, type: Toast["type"] = "info") => {
    toastId++;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
  };
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, addToast, removeToast };
}

const iconMap = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
};

export default function Toaster({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => removeToast(toasts[0].id), 2200);
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-2 rounded shadow-lg flex items-center gap-2 font-semibold animate-fade-in-up transition-all
            ${toast.type === "success" ? "bg-green-100 border border-green-400 text-green-800" : ""}
            ${toast.type === "error" ? "bg-red-100 border border-red-400 text-red-800" : ""}
            ${toast.type === "info" ? "bg-amber-100 border border-amber-400 text-amber-900" : ""}
          `}
        >
          <span className="text-lg">{iconMap[toast.type || "info"]}</span>
          <span>{toast.message}</span>
          <button
            className="ml-2 text-slate-400 hover:text-slate-700 font-bold text-lg focus:outline-none"
            onClick={() => removeToast(toast.id)}
            aria-label="Fermer la notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

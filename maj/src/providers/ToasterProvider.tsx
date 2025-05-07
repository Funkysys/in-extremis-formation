"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import Toaster from "@/components/formationUi/Toaster";

type Toast = { id: number; message: string; type?: "success" | "error" | "info" };
type ToasterContextType = {
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: number) => void;
};

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);
let toastId = 0;

export function useToaster() {
  const ctx = useContext(ToasterContext);
  if (!ctx) throw new Error("useToaster must be used within a ToasterProvider");
  return ctx;
}

export default function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string, type: Toast["type"] = "info") => {
    toastId++;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
  };
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToasterContext.Provider value={{ addToast, removeToast }}>
      <Toaster toasts={toasts} removeToast={removeToast} />
      {children}
    </ToasterContext.Provider>
  );
}

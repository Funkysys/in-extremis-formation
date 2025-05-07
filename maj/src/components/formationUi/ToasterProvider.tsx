"use client";
import { ReactNode } from "react";
import Toaster, { useToaster } from "./Toaster";

export default function ToasterProvider({ children }: { children: ReactNode }) {
  const { toasts, removeToast } = useToaster();
  return (
    <>
      <Toaster toasts={toasts} removeToast={removeToast} />
      {children}
    </>
  );
}

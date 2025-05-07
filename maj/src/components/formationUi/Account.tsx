"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";
import { DELETE_USER_MUTATION } from "@/graphql/mutations/user-mutations";

interface AccountProps {
  onClose: () => void;
}

export default function Account({ onClose }: AccountProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      const { data } = await deleteUser();
      if (data?.deleteUser?.success) {
        setIsDeleting(false);
        setShowConfirm(false);
        onClose();
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError(data?.deleteUser?.error || "Erreur lors de la suppression du compte.");
        setIsDeleting(false);
      }
    } catch (e: any) {
      setError(e.message || "Erreur lors de la suppression du compte.");
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, right: "-100vw" }}
      animate={{ opacity: 1, right: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut", delay: 0 }}
      exit={{ opacity: 0, right: "-100vw" }}
      className={
        "fixed right-4 rounded-md h-[100%] w-[100vw] lg:w-[30vw] z-50 bg-sky-100 p-4"
      }
    >
      <button
        onClick={onClose}
        className="btn absolute right-2 top-2 bg-amber-300 hover:bg-amber-400 drawer-button shadow-none text-slate-900 border-none"
      >
        Fermer
      </button>
      <h2 className="text-lg font-bold text-slate-900 mb-4">Mon compte</h2>
      <div className="flex flex-col gap-4">
        <button
          className="btn w-full bg-sky-300 hover:bg-sky-400 text-slate-900 border-none shadow-none"
          onClick={() => {
            onClose();
            router.push("/profile/infos");
          }}
        >
          Voir mes informations
        </button>
        <button
          className="btn w-full bg-amber-200 hover:bg-amber-300 text-slate-900 border-none shadow-none"
          onClick={() => alert("À venir : Mes achats")}
        >
          Mes achats
        </button>
        <button
          className="btn w-full bg-green-200 hover:bg-green-400 text-green-900 border-none shadow-none"
          onClick={() => {
            localStorage.removeItem("token");
            onClose();
            router.push("/");
          }}
        >
          Se déconnecter
        </button>
        <button
          className="btn w-full bg-red-200 hover:bg-red-400 text-red-900 border-none shadow-none"
          onClick={() => setShowConfirm(true)}
        >
          Supprimer mon compte
        </button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-md p-6 shadow-lg flex flex-col items-center">
            <p className="mb-4 text-lg text-red-700 font-semibold">
              Êtes-vous sûr de vouloir supprimer votre compte ?<br />
              Cette action est <span className="font-bold">irréversible</span> !
            </p>
            {error && (
              <div className="text-error text-sm mb-2">{error}</div>
            )}
            <div className="flex gap-4">
              <button
                className="btn bg-red-400 hover:bg-red-600 text-white border-none"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Oui, supprimer"}
              </button>
              <button
                className="btn bg-slate-200 hover:bg-slate-300 text-slate-800 border-none"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

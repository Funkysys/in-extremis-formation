"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface AccountProps {
  onClose: () => void;
  role?: string | null;
}

export default function Account({ onClose, role }: AccountProps) {
  const router = useRouter();


  return (
    <motion.div
      initial={{ opacity: 0, right: "-100vw" }}
      animate={{ opacity: 1, right: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut", delay: 0 }}
      exit={{ opacity: 0, right: "-100vw" }}
      className={
        "fixed right-4 rounded-md h-[100%] w-[100vw] lg:w-[20vw] xl:w-[15vw] z-50 bg-sky-100 p-4"
      }
    >
      <button
        onClick={onClose}
        className="btn absolute right-2 top-2 bg-amber-300 hover:bg-amber-400 drawer-button shadow-none text-slate-900 border-none"
      >
        Fermer
      </button>
      <h2 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-slate-800">Mon compte</h2>
      <div className="flex flex-col gap-4">
        <Link href="/profile/infos" >       
        <button
          className="btn btn-primary w-full text-white font-semibold shadow-md hover:brightness-110"
        >
          Voir mes informations
        </button>
        </Link>
        <button
          className="btn w-full bg-green-600 hover:bg-green-800 text-slate-100 font-semibold shadow-md"
          onClick={() => alert("À venir : Mes achats")}
        >
          Mes achats
        </button>
        {(role === "formateur" || role === "admin" || role === "superadmin") && (
          <button
            className="btn w-full bg-amber-700 hover:bg-amber-800 text-slate-100 font-semibold shadow-md flex items-center gap-2"
            onClick={() => {
              onClose();
              router.push("/formateur/videos");
            }}
            data-tip="Gérer mes vidéos"
          >
            <span role="img" aria-label="vidéos">🎬</span> Gérer mes vidéos
          </button>
        )}
        
        <button
          className="btn btn-outline w-full bg-slate-700 text-white font-semibold shadow-md hover:bg-slate-900 border-none"
          onClick={() => {
            localStorage.removeItem("token");
            onClose();
            router.push("/");
          }}
        >
          Se déconnecter
        </button>
      </div>

    </motion.div>
  );
}

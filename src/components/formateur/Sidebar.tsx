"use client";
import { ME_QUERY } from "@/graphql/queries/user-queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiOutlineClipboardList,
  HiOutlineUserCircle,
  HiUserGroup,
} from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isFormateurRoot = pathname === "/formateur";
  const isInFormateurSubpage =
    pathname.startsWith("/formateur") && !isFormateurRoot;
  // Apollo pour récupérer les rôles
  const { data } = useQuery(ME_QUERY);
  const roles = data?.me?.role ? [data.me.role] : [];
  const isAdmin = roles.includes("admin");

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-amber-950 border-r border-base-300 flex flex-col transition-all duration-300 ease-in-out ${
        open ? "w-56" : "w-16"
      } shadow-lg min-w-[4rem] max-w-xs`}
      style={{ minHeight: "100vh" }}
      aria-label="Sidebar formateur"
    >
      <button
        className="btn btn-ghost mt-2 mb-2 self-end mr-2 md:inline-block hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Réduire la sidebar" : "Ouvrir la sidebar"}
        tabIndex={0}
      >
        <span
          className={`transition-transform text-2xl duration-300 ease-in-out ${
            open ? "rotate-0" : "rotate-180"
          }`}
        >
          {open ? "⮜" : "⮞"}
        </span>
      </button>
      {isInFormateurSubpage && (
        <button
          className={`btn btn-ghost flex items-center gap-2 mb-2 ml-2 mr-2 transition-colors group ${
            open ? "" : "justify-center"
          }`}
          onClick={() => router.back()}
          aria-label="Retour"
        >
          <IoArrowBack className="text-xl" />
          {open && <span className="font-medium">Retour</span>}
          {!open && <span className="sr-only">Retour</span>}
        </button>
      )}
      <button
        className="btn btn-square btn-ghost mt-2 mb-4 ml-2 md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir le menu"
        tabIndex={0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <nav className="flex flex-col gap-2 mt-2">
        <Link
          href="/formateur/cours"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group
            ${
              pathname === "/formateur/cours"
                ? "bg-primary text-white font-semibold shadow"
                : "hover:bg-warning hover:text-slate-800"
            }
          `}
          aria-current={pathname === "/formateur/cours" ? "page" : undefined}
        >
          <HiOutlineClipboardList
            className={`text-xl group-hover:scale-110 transition-transform ${
              pathname === "/formateur/cours" ? "scale-110" : ""
            }`}
          />
          {open && <span className="font-medium">Mes cours</span>}
        </Link>
        <Link
          href="/formateur/creer-formation"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group hover:bg-success hover:text-white`}
        >
          <svg
            className="text-xl"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {open && <span className="font-medium">Créer formation</span>}
        </Link>
        <Link
          href="/formateur/profil"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group
            ${
              pathname === "/formateur/profil"
                ? "bg-primary text-white font-semibold shadow"
                : "hover:bg-warning hover:text-slate-800"
            }
          `}
          aria-current={pathname === "/formateur/profil" ? "page" : undefined}
        >
          <HiOutlineUserCircle
            className={`text-xl group-hover:scale-110 transition-transform ${
              pathname === "/formateur/profil" ? "scale-110" : ""
            }`}
          />
          {open && <span className="font-medium">Mon profil</span>}
        </Link>
      </nav>
      <div className="flex-1" />
      {/* Bouton espace admin, affiché uniquement si user a le rôle admin */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-3 px-4 py-2 mb-2 rounded-lg transition-colors group hover:bg-sky-700 hover:text-white"
          aria-label="Espace admin"
        >
          <HiUserGroup className="text-xl" />
          {open && <span className="font-medium">Espace admin</span>}
        </Link>
      )}
      <Link
        href="/formation"
        className="flex items-center gap-3 px-4 py-2 mb-2 rounded-lg transition-colors group hover:bg-warning hover:text-slate-800"
        aria-label="Accueil des formations"
      >
        <svg
          className="text-xl"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          width="24"
          height="24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
          />
        </svg>
        {open && <span className="font-medium">Accueil formations</span>}
      </Link>
      <button
        className="flex items-center gap-3 px-4 py-2 mb-4 rounded-lg transition-colors group hover:bg-error hover:text-white bg-slate-700 text-white font-semibold shadow-md border-none"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/");
        }}
        aria-label="Se déconnecter"
      >
        <svg
          className="text-xl"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          width="24"
          height="24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2h-3a2 2 0 01-2-2V7a2 2 0 012-2h3a2 2 0 012 2v1"
          />
        </svg>
        {open && <span className="font-medium">Se déconnecter</span>}
      </button>
    </aside>
  );
}

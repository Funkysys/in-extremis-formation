// Constantes: navigation - Items de navigation admin

import { HiUserGroup } from "react-icons/hi";

export const ADMIN_NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    icon: "📊",
    label: "Dashboard",
    key: "dashboard",
  },
  {
    href: "/admin/users",
    icon: HiUserGroup,
    label: "Utilisateurs",
    key: "users",
  },
  {
    href: "/admin/videos",
    icon: "🎥",
    label: "Vidéos",
    key: "videos",
  },
  {
    href: "/admin/payments",
    icon: "💰",
    label: "Paiements",
    key: "payments",
  },
  {
    href: "/admin/roles",
    icon: "🔐",
    label: "Rôles",
    key: "roles",
  },
] as const;

export const FOOTER_LINKS = [
  {
    href: "/formateur",
    icon: "formateur",
    label: "Espace formateur",
    hoverClass: "hover:bg-sky-700 hover:text-white",
  },
  {
    href: "/formation",
    icon: "home",
    label: "Accueil formations",
    hoverClass: "hover:bg-warning hover:text-slate-800",
  },
] as const;

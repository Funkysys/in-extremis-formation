"use client";

import { ADMIN_NAV_ITEMS, FOOTER_LINKS } from "@/lib/admin/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FooterLink } from "./shared/FooterLink";
import { LogoutButton } from "./shared/LogoutButton";
import { NavItem } from "./shared/NavItem";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdminRoot = pathname === "/admin";
  const isInAdminSubpage = pathname.startsWith("/admin") && !isAdminRoot;

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-amber-950 border-r border-base-300 flex flex-col transition-all duration-300 ease-in-out ${
        open ? "w-56" : "w-16"
      } shadow-lg min-w-[4rem] max-w-xs`}
      style={{ minHeight: "100vh" }}
      aria-label="Sidebar admin"
    >
      {/* Toggle Button Desktop */}
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

      {/* Bouton retour */}
      {isInAdminSubpage && (
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

      {/* Hamburger Mobile */}
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

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 mt-2">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavItem
            key={item.key}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
            isOpen={open}
          />
        ))}
      </nav>

      <div className="flex-1" />

      {/* Footer Links */}
      {FOOTER_LINKS.map((link) => (
        <FooterLink key={link.href} {...link} isOpen={open} />
      ))}

      <LogoutButton isOpen={open} />
    </aside>
  );
}

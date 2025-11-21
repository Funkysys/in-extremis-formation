// Composant: NavItem - Item de navigation pour la sidebar

import Link from "next/link";
import type { IconType } from "react-icons";

interface NavItemProps {
  href: string;
  icon: string | IconType;
  label: string;
  isActive: boolean;
  isOpen: boolean;
}

export const NavItem = ({
  href,
  icon,
  label,
  isActive,
  isOpen,
}: NavItemProps) => {
  const Icon = typeof icon !== "string" ? icon : null;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group
        ${
          isActive
            ? "bg-primary text-white font-semibold shadow"
            : "hover:bg-warning hover:text-slate-800"
        }
      `}
      aria-current={isActive ? "page" : undefined}
    >
      {Icon ? (
        <Icon
          className={`text-xl group-hover:scale-110 transition-transform ${
            isActive ? "scale-110" : ""
          }`}
        />
      ) : (
        <span className="text-xl">{icon as string}</span>
      )}
      {isOpen && <span className="font-medium">{label}</span>}
    </Link>
  );
};

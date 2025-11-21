// Composant: FooterLink - Lien de footer pour la sidebar

import Link from "next/link";

interface FooterLinkProps {
  href: string;
  icon: "formateur" | "home";
  label: string;
  hoverClass: string;
  isOpen: boolean;
}

export const FooterLink = ({
  href,
  icon,
  label,
  hoverClass,
  isOpen,
}: FooterLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 mb-2 rounded-lg transition-colors group ${hoverClass}`}
      aria-label={label}
    >
      <span className="text-xl">
        {icon === "formateur" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
          </svg>
        ) : (
          <svg
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
        )}
      </span>
      {isOpen && <span className="font-medium">{label}</span>}
    </Link>
  );
};

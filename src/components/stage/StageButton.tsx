// Composant bouton réutilisable pour les pages stage

import Link from "next/link";

interface StageButtonProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function StageButton({
  href,
  children,
  external = false,
}: StageButtonProps) {
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
  console.log("StageButton rendered with href:", href);
  return (
    <Link
      href={href}
      {...linkProps}
      className="inline-block px-8 py-3 text-lg font-bold transition-colors duration-300 rounded-lg hover:opacity-90"
      style={{
        backgroundColor: "var(--color-button-bg-stage)",
        color: "var(--color-button-text-stage)",
      }}
    >
      {children}
    </Link>
  );
}

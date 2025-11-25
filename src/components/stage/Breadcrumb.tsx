"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumb() {
  const pathname = usePathname();

  // Générer les items du breadcrumb basé sur le chemin
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = [{ label: "Accueil", href: "/" }];

  // Ajouter les segments du chemin
  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Mapper les segments vers des labels lisibles
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    if (segment === "stage") label = "Stages";
    if (segment === "cevennole") label = "Stage Cévenol";

    breadcrumbItems.push({
      label,
      href: currentPath,
    });
  });

  return (
    <nav
      className="fixed z-50 px-4 py-2 rounded-lg shadow-lg top-4 left-4 backdrop-blur-sm"
      style={{
        background: "var(--color-background-secondary-stage)",
        borderColor: "var(--color-border-stage)",
        border: "1px solid",
      }}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {!isLast ? (
                <>
                  <Link
                    href={item.href}
                    className="transition-colors hover:underline"
                    style={{ color: "var(--color-primary-stage)" }}
                  >
                    {item.label}
                  </Link>
                  <span
                    style={{
                      color: "var(--color-foreground-stage)",
                      opacity: 0.5,
                    }}
                  >
                    /
                  </span>
                </>
              ) : (
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-foreground-stage)" }}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

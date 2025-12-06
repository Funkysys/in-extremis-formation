import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { locales } from "./i18n";

// Créer le middleware i18n
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "fr",
  localePrefix: "as-needed", // Ne pas préfixer la locale par défaut (fr)
});

// Middleware combiné
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes sans i18n (page d'accueil, stage, etc.)
  const excludeFromI18n = [
    "/",
    "/stage",
    "/offline",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/formation",
    "/admin",
    "/formateur",
    "/cart",
    "/chat",
    "/live",
    "/ma-formation",
    "/payment",
    "/profile",
  ];
  if (
    excludeFromI18n.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return NextResponse.next();
  }

  // Routes protégées
  const adminRoutes = ["/admin"];
  const formateurRoutes = ["/formateur"];

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isFormateurRoute = formateurRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si la route n'est pas protégée, appliquer le middleware i18n
  if (!isAdminRoute && !isFormateurRoute) {
    return intlMiddleware(request);
  }

  // Pour les routes protégées, appliquer d'abord i18n puis laisser passer
  const response = intlMiddleware(request);
  return response || NextResponse.next();
}

// Configuration du middleware pour s'exécuter sur les chemins spécifiés
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth|sw.js|manifest.json|images).*)",
  ],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// import { jwtDecode } from 'jwt-decode';

// type UserRole = 'user' | 'formateur' | 'admin';

// interface JwtPayload {
//   role?: UserRole;
//   [key: string]: any;
// }

// Middleware simplifié - La vérification complète se fera côté client
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes protégées
  const adminRoutes = ["/admin"];
  const formateurRoutes = ["/formateur"];

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isFormateurRoute = formateurRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si la route n'est pas protégée, on laisse passer
  if (!isAdminRoute && !isFormateurRoute) {
    return NextResponse.next();
  }

  // La vérification complète se fera côté client via le composant de protection de route
  // On laisse passer la requête, et c'est le composant qui gérera la redirection si nécessaire
  return NextResponse.next();

  // Tout est bon, on laisse passer la requête
  return NextResponse.next();
}

// Configuration du middleware pour s'exécuter sur les chemins spécifiés
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/).*)"],
};

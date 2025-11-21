// Constantes pour l'administration

export const STAT_COLORS = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
} as const;

export const ADMIN_ROUTES = {
  dashboard: "/admin/dashboard",
  users: "/admin/users",
  videos: "/admin/videos",
  payments: "/admin/payments",
  roles: "/admin/roles",
} as const;

export const QUERY_LIMITS = {
  default: 1000,
  offset: 0,
} as const;

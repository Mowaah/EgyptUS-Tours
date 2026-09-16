import type { AdminRolePermissions } from "@/components/dashboard/AccessControl/types";

export type AdminModuleKey =
  | "dashboard"
  | "leads"
  | "bookings"
  | "requests"
  | "customers"
  | "catalog"
  | "finance"
  | "marketing"
  | "reviews"
  | "reports"
  | "settings"
  | "legal_help_center"
  | "seo";

export type AdminActionKey = "view" | "create" | "edit";

export const ALL_MODULE_KEYS: AdminModuleKey[] = [
  "dashboard",
  "leads",
  "bookings",
  "requests",
  "customers",
  "catalog",
  "finance",
  "marketing",
  "reviews",
  "reports",
  "settings",
  "legal_help_center",
  "seo",
];

const ALL_TRUE_MATRIX: Record<AdminModuleKey, Record<AdminActionKey, boolean>> = ALL_MODULE_KEYS.reduce(
  (acc, key) => {
    acc[key] = { view: true, create: true, edit: true };
    return acc;
  },
  {} as Record<AdminModuleKey, Record<AdminActionKey, boolean>>
);

/**
 * Seeded default role permissions matrix matching backend migrations.
 * Used as an automatic fallback when backend has not yet attached permissions to profile.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<
  string,
  Partial<Record<AdminModuleKey, Partial<Record<AdminActionKey, boolean>>>>
> = {
  super_admin: ALL_TRUE_MATRIX,
  operations: {
    dashboard: { view: true, create: false, edit: false },
    leads: { view: true, create: false, edit: false },
    bookings: { view: true, create: true, edit: true },
    requests: { view: true, create: true, edit: true },
    customers: { view: true, create: false, edit: false },
    catalog: { view: true, create: true, edit: true },
    finance: { view: true, create: false, edit: false },
    marketing: { view: true, create: false, edit: false },
    reviews: { view: true, create: false, edit: false },
    reports: { view: true, create: false, edit: false },
    settings: { view: true, create: true, edit: true },
    legal_help_center: { view: true, create: true, edit: true },
    seo: { view: true, create: false, edit: false },
  },
  sales: {
    dashboard: { view: true, create: false, edit: false },
    leads: { view: true, create: true, edit: true },
    bookings: { view: true, create: true, edit: true },
    requests: { view: true, create: true, edit: true },
    customers: { view: true, create: true, edit: true },
    reports: { view: true, create: false, edit: false },
  },
  support: {
    dashboard: { view: true, create: false, edit: false },
    leads: { view: true, create: false, edit: true },
    customers: { view: true, create: false, edit: true },
    legal_help_center: { view: true, create: true, edit: true },
    reviews: { view: true, create: true, edit: true },
  },
};

export interface AdminUserPermissionsSubject {
  role?: string;
  is_super_admin?: boolean;
  permissions?: AdminRolePermissions;
}

/**
 * Checks whether the admin user has permission for the specified module and action.
 */
export function checkAdminPermission(
  user: AdminUserPermissionsSubject | null | undefined,
  module: AdminModuleKey,
  action: AdminActionKey = "view"
): boolean {
  if (!user) return false;

  // 1. Super admins always have full permissions
  if (user.is_super_admin || user.role === "super_admin") {
    return true;
  }

  // 2. Dynamic permissions from backend /me/ response
  if (user.permissions && Object.keys(user.permissions).length > 0) {
    const modPermissions = user.permissions[module];
    if (modPermissions && typeof modPermissions[action] === "boolean") {
      return modPermissions[action];
    }
  }

  // 3. Fallback to seeded matrix based on role slug
  if (user.role && DEFAULT_ROLE_PERMISSIONS[user.role]) {
    const roleMatrix = DEFAULT_ROLE_PERMISSIONS[user.role];
    const modPermissions = roleMatrix[module];
    if (modPermissions && typeof modPermissions[action] === "boolean") {
      return modPermissions[action];
    }
  }

  return false;
}

/**
 * Route mapping table for the dashboard.
 * Maps pathname prefixes to their corresponding permission module.
 */
const ROUTE_MODULE_MAP: { prefix: string; module: AdminModuleKey }[] = [
  { prefix: "/dashboard/leads", module: "leads" },
  { prefix: "/dashboard/bookings", module: "bookings" },
  { prefix: "/dashboard/requests", module: "requests" },
  { prefix: "/dashboard/customers", module: "customers" },
  { prefix: "/dashboard/catalog", module: "catalog" },
  { prefix: "/dashboard/finance", module: "finance" },
  { prefix: "/dashboard/marketing", module: "marketing" },
  { prefix: "/dashboard/reviews", module: "reviews" },
  { prefix: "/dashboard/analytics", module: "reports" },
  { prefix: "/dashboard/settings/faq-management", module: "legal_help_center" },
  { prefix: "/dashboard/settings/terms-conditions", module: "legal_help_center" },
  { prefix: "/dashboard/settings/privacy-policy", module: "legal_help_center" },
  { prefix: "/dashboard/settings", module: "settings" },
  { prefix: "/dashboard/seo", module: "seo" },
];

/**
 * Resolves which permission module is required for a given dashboard path.
 * Returns null for universally accessible staff pages (like profile, notifications, or dashboard home).
 */
export function resolveModuleFromPathname(pathname: string): AdminModuleKey | null {
  for (const entry of ROUTE_MODULE_MAP) {
    if (pathname === entry.prefix || pathname.startsWith(entry.prefix + "/")) {
      return entry.module;
    }
  }

  if (pathname === "/dashboard") {
    return "dashboard";
  }

  return null;
}

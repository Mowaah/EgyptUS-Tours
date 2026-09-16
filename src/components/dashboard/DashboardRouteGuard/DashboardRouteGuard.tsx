"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { resolveModuleFromPathname } from "@/utils/adminPermissions";
import { LoadingSpinner } from "@/components/shared";
import styles from "./DashboardRouteGuard.module.scss";

export default function DashboardRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoadingAdmin, canView, canCreate, canEdit } = useAdminAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoadingAdmin) {
      return;
    }

    const requiredModule = resolveModuleFromPathname(pathname);

    // If no module required (e.g. notifications, profile, or unmapped path), allow access
    if (!requiredModule) {
      setIsAuthorized(true);
      return;
    }

    // Check if route is a creation route (/new, /create) or an edit route (/edit)
    const isCreateRoute = pathname.endsWith("/new") || pathname.endsWith("/create");
    const isEditRoute = pathname.endsWith("/edit") || pathname.includes("/edit/");

    let hasAccess = canView(requiredModule);
    if (isCreateRoute) {
      hasAccess = canCreate(requiredModule);
    } else if (isEditRoute) {
      hasAccess = canEdit(requiredModule);
    }

    if (!hasAccess) {
      setIsAuthorized(false);
      // If unauthorized on a subpage, redirect to /dashboard
      if (pathname !== "/dashboard") {
        router.replace("/dashboard");
      }
      return;
    }

    setIsAuthorized(true);
  }, [pathname, isLoadingAdmin, canView, canCreate, canEdit, router]);

  if (isLoadingAdmin || !isAuthorized) {
    return (
      <div className={styles.guardLoading} aria-live="polite">
        <LoadingSpinner size="lg" label="Checking permissions..." />
      </div>
    );
  }

  return <>{children}</>;
}

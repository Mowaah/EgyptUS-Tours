"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getAdminProfile, logoutAdmin, refreshAdminToken } from "@/lib/adminCoreApi";

import type { AdminRolePermissions } from "@/components/dashboard/AccessControl/types";
import {
  checkAdminPermission,
  type AdminModuleKey,
  type AdminActionKey,
} from "@/utils/adminPermissions";

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  bio?: string;
  job_title?: string;
  department?: string;
  role: string;
  role_label?: string;
  is_active: boolean;
  is_super_admin?: boolean;
  permissions?: AdminRolePermissions;
  totp_enabled?: boolean;
  profile_picture?: string | null;
  last_login?: string | null;
  updated_at?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoadingAdmin: boolean;
  isSuperAdmin: boolean;
  hasPermission: (module: AdminModuleKey, action: AdminActionKey) => boolean;
  canView: (module: AdminModuleKey) => boolean;
  canCreate: (module: AdminModuleKey) => boolean;
  canEdit: (module: AdminModuleKey) => boolean;
  loginAdminTokens: (access: string, refresh: string, userData: AdminUser) => void;
  logoutAdminTokens: () => void;
  updateAdminUser: (userData: AdminUser) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initAuth() {
      const accessToken = Cookies.get("admin_access_token");
      const refreshToken = Cookies.get("admin_refresh_token");

      if (accessToken) {
        try {
          const data = await getAdminProfile();
          if (!isCancelled) {
            if (data && (data.id || data.email)) {
              setAdminUser(data);
            } else {
              throw new Error("Invalid admin user data");
            }
          }
        } catch (err) {
          console.error("Failed to fetch admin profile with access token", err);
          if (refreshToken) {
            try {
              const res = await refreshAdminToken(refreshToken);
              if (res?.access) {
                Cookies.set("admin_access_token", res.access, { expires: 1 });
                const retryProfile = await getAdminProfile();
                if (!isCancelled) {
                  if (retryProfile && (retryProfile.id || retryProfile.email)) {
                    setAdminUser(retryProfile);
                    return;
                  }
                }
              }
            } catch (refreshErr) {
              console.error("Failed to refresh admin token on mount", refreshErr);
            }
          }
          if (!isCancelled) {
            logoutAdminTokens();
          }
        } finally {
          if (!isCancelled) {
            setIsLoadingAdmin(false);
          }
        }
      } else if (refreshToken) {
        try {
          const res = await refreshAdminToken(refreshToken);
          if (res?.access) {
            Cookies.set("admin_access_token", res.access, { expires: 1 });
            const data = await getAdminProfile();
            if (!isCancelled) {
              if (data && (data.id || data.email)) {
                setAdminUser(data);
              } else {
                throw new Error("Invalid admin user data");
              }
            }
          } else {
            throw new Error("No access token returned from refresh");
          }
        } catch (err) {
          console.error("Failed to refresh admin token on mount", err);
          if (!isCancelled) {
            logoutAdminTokens();
          }
        } finally {
          if (!isCancelled) {
            setIsLoadingAdmin(false);
          }
        }
      } else {
        if (!isCancelled) {
          setIsLoadingAdmin(false);
        }
      }
    }

    initAuth();

    return () => {
      isCancelled = true;
    };
  }, []);

  const loginAdminTokens = (access: string, refresh: string, userData: AdminUser) => {
    Cookies.set("admin_access_token", access, { expires: 1 }); // 1 day
    Cookies.set("admin_refresh_token", refresh, { expires: 7 }); // 7 days
    setAdminUser(userData);
  };

  const logoutAdminTokens = () => {
    const refreshToken = Cookies.get("admin_refresh_token");
    const accessToken = Cookies.get("admin_access_token");
    if (refreshToken && accessToken) {
      logoutAdmin({ refresh: refreshToken }, accessToken).catch(err => console.error("Admin logout failed", err));
    }
    Cookies.remove("admin_access_token");
    Cookies.remove("admin_refresh_token");
    setAdminUser(null);
  };

  const updateAdminUser = (userData: AdminUser) => {
    setAdminUser(userData);
  };

  const isSuperAdmin = Boolean(adminUser?.is_super_admin || adminUser?.role === "super_admin");

  const hasPermission = (module: AdminModuleKey, action: AdminActionKey): boolean => {
    return checkAdminPermission(adminUser, module, action);
  };

  const canView = (module: AdminModuleKey): boolean => {
    return checkAdminPermission(adminUser, module, "view");
  };

  const canCreate = (module: AdminModuleKey): boolean => {
    return checkAdminPermission(adminUser, module, "create");
  };

  const canEdit = (module: AdminModuleKey): boolean => {
    return checkAdminPermission(adminUser, module, "edit");
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        adminUser, 
        isAdminAuthenticated: !!adminUser, 
        isLoadingAdmin, 
        isSuperAdmin,
        hasPermission,
        canView,
        canCreate,
        canEdit,
        loginAdminTokens, 
        logoutAdminTokens,
        updateAdminUser
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getAdminProfile, logoutAdmin } from "@/lib/adminCoreApi";

interface AdminUser {
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
  totp_enabled?: boolean;
  profile_picture?: string | null;
  last_login?: string | null;
  updated_at?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoadingAdmin: boolean;
  loginAdminTokens: (access: string, refresh: string, userData: AdminUser) => void;
  logoutAdminTokens: () => void;
  updateAdminUser: (userData: AdminUser) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);

  useEffect(() => {
    // Check if we have an admin access token on mount
    const accessToken = Cookies.get("admin_access_token");
    if (accessToken) {
      getAdminProfile()
        .then((data: any) => {
          setAdminUser(data); 
        })
        .catch((err) => {
          console.error("Failed to fetch admin profile", err);
          logoutAdminTokens();
        })
        .finally(() => {
          setIsLoadingAdmin(false);
        });
    } else {
      setIsLoadingAdmin(false);
    }
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

  return (
    <AdminAuthContext.Provider 
      value={{ 
        adminUser, 
        isAdminAuthenticated: !!adminUser, 
        isLoadingAdmin, 
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

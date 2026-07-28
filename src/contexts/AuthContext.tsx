"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { apiClient, logoutCustomer } from "@/lib/api";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface User {
  id: number;
  full_name: string;
  email: string;
  auth_provider: string;
  is_email_verified: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have an access token on mount
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      // Fetch user profile from /me endpoint
      apiClient.get("/auth/me/")
        .then((data: any) => {
          setUser(data); // data is already unwrapped by our interceptor
        })
        .catch((err) => {
          console.error("Failed to fetch user profile", err);
          // If the token is totally dead (and refresh failed), clear it
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (access: string, refresh: string, userData: User) => {
    Cookies.set("access_token", access, { expires: 1 }); // 1 day
    Cookies.set("refresh_token", refresh, { expires: 7 }); // 7 days
    setUser(userData);
  };

  const logout = () => {
    const refreshToken = Cookies.get("refresh_token");
    const accessToken = Cookies.get("access_token");
    if (refreshToken && accessToken) {
      // Fire and forget, we clear local state instantly either way
      logoutCustomer({ refresh: refreshToken }, accessToken).catch(err => console.error("Logout failed", err));
    }
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      <GoogleOAuthProvider clientId={googleClientId}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

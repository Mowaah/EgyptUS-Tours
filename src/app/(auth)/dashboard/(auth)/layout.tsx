import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

export const metadata: Metadata = {
  title: "Sign In | Egypt-Us Dashboard",
  description: "Access and manage your tourism platform",
};

export default async function DashboardAuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_access_token")?.value || cookieStore.get("admin_refresh_token")?.value;
  
  if (adminToken) {
    redirect("/dashboard");
  }

  return (
    <AdminAuthProvider>
      <div data-auth-layout>{children}</div>
    </AdminAuthProvider>
  );
}

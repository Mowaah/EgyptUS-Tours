import Script from "next/script";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_access_token")?.value || cookieStore.get("admin_refresh_token")?.value;
  
  if (!adminToken) {
    redirect("/dashboard/login");
  }

  const saved = cookieStore.get("sidebarOpenGroups")?.value;
  let initialOpenGroups: Record<string, boolean> = {};

  if (saved) {
    try {
      initialOpenGroups = JSON.parse(decodeURIComponent(saved));
    } catch (e) {}
  }

  return (
    <AdminAuthProvider>
      <SidebarProvider initialOpenGroups={initialOpenGroups}>
        <div data-dashboard-layout>{children}</div>
        <Script id="restore-sidebar-scroll">
          {`
            try {
              var saved = localStorage.getItem('sidebarScrollPos');
              if (saved) {
                var el = document.getElementById('dashboard-sidebar-scroll');
                if (el) el.scrollTop = parseInt(saved, 10);
              }
            } catch(e) {}
          `}
        </Script>
      </SidebarProvider>
    </AdminAuthProvider>
  );
}

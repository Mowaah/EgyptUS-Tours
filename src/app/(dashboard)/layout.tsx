import { cookies } from "next/headers";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const saved = cookieStore.get("sidebarOpenGroups")?.value;
  let initialOpenGroups: Record<string, boolean> = {};

  if (saved) {
    try {
      initialOpenGroups = JSON.parse(decodeURIComponent(saved));
    } catch (e) {}
  }

  return (
    <SidebarProvider initialOpenGroups={initialOpenGroups}>
      <div data-dashboard-layout>{children}</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              var saved = localStorage.getItem('sidebarScrollPos');
              if (saved) {
                var el = document.getElementById('dashboard-sidebar-scroll');
                if (el) el.scrollTop = parseInt(saved, 10);
              }
            } catch(e) {}
          `,
        }}
      />
    </SidebarProvider>
  );
}

"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

interface SidebarContextType {
  openGroups: Record<string, boolean>;
  toggleGroup: (label: string) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ 
  children, 
  initialOpenGroups 
}: { 
  children: ReactNode; 
  initialOpenGroups: Record<string, boolean>;
}) {
  const pathname = usePathname();
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    if (Object.keys(initialOpenGroups).length > 0) {
      return initialOpenGroups;
    }

    const groups: Record<string, boolean> = {};

    if (pathname.startsWith("/dashboard/settings")) groups.Settings = true;
    if (pathname.startsWith("/dashboard/settings/faq-management") ||
        pathname.startsWith("/dashboard/settings/terms-conditions") ||
        pathname.startsWith("/dashboard/settings/privacy-policy")) {
      groups["Legal & Help Center"] = true;
    }
    if (pathname.startsWith("/dashboard/marketing")) groups.Marketing = true;
    if (pathname.startsWith("/dashboard/finance")) groups.Finance = true;

    return groups;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((current) => {
      const next = { ...current, [label]: !current[label] };
      document.cookie = `sidebarOpenGroups=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=31536000`;
      localStorage.setItem("sidebarOpenGroups", JSON.stringify(next));
      return next;
    });
  };

  return (
    <SidebarContext.Provider value={{ openGroups, toggleGroup }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("Missing SidebarProvider");
  return ctx;
}

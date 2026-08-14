"use client";

import useSWR from "swr";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { SystemConfiguration } from "@/components/dashboard/SystemConfiguration";
import { getSystemConfig } from "@/services/admin/adminSystemConfigService";

export default function SystemConfigurationPage() {
  const { data: config, isLoading } = useSWR("/system-config/", getSystemConfig);

  return (
    <>
      <DashboardNavbar hidePrimaryAction />
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading configuration...</div>
      ) : (
        <SystemConfiguration initialConfig={config} />
      )}
    </>
  );
}

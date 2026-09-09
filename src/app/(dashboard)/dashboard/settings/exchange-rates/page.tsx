"use client";

import useSWR from "swr";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { ExchangeRates } from "@/components/dashboard/ExchangeRates";
import { getExchangeRates } from "@/services/admin/adminExchangeRatesService";

export default function ExchangeRatesPage() {
  const { data: config, isLoading } = useSWR("/system-config/", getExchangeRates);

  return (
    <>
      <DashboardNavbar hidePrimaryAction />
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Loading exchange rates...
        </div>
      ) : (
        <ExchangeRates initialData={config} />
      )}
    </>
  );
}

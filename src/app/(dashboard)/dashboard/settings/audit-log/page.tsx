"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { AuditLog } from "@/components/dashboard/AuditLog";
import styles from "../../page.module.scss";

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <AuditLog searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
    </>
  );
}

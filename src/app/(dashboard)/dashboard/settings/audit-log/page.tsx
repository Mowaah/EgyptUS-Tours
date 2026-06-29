"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { AuditLog } from "@/components/dashboard/AuditLog";
import styles from "../../page.module.scss";

export default function AuditLogPage() {
  return (
    <>
      
      
        <DashboardNavbar />
        <AuditLog />
      
    </>
  );
}

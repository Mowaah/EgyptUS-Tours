"use client";

import { useState } from "react";
import { AccessControl } from "@/components/dashboard/AccessControl";
import DashboardRoleModal from "@/components/dashboard/DashboardRoleModal";
import type { DashboardRoleModalSubmitValues } from "@/components/dashboard/DashboardRoleModal";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../../page.module.scss";

export default function AccessControlPage() {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>();

  const handleCreateRole = ({ name }: DashboardRoleModalSubmitValues) => {
    setCustomRoles((current) => [...current, name]);
    setSelectedRole(name);
    setRoleModalOpen(false);
  };

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Access control content">
        <DashboardNavbar onPrimaryAction={() => setRoleModalOpen(true)} />
        <AccessControl
          customRoles={customRoles}
          selectedRole={selectedRole}
          onSelectedRoleChange={setSelectedRole}
        />
      </section>

      <DashboardRoleModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleCreateRole}
      />
    </main>
  );
}

"use client";

import { useState } from "react";
import { AccessControl } from "@/components/dashboard/AccessControl";
import DashboardRoleModal from "@/components/dashboard/DashboardRoleModal";
import type { DashboardRoleModalSubmitValues } from "@/components/dashboard/DashboardRoleModal";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
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
    <>
      
      
        <DashboardNavbar onPrimaryAction={() => setRoleModalOpen(true)} />
        <AccessControl
          customRoles={customRoles}
          selectedRole={selectedRole}
          onSelectedRoleChange={setSelectedRole}
        />
      

      <DashboardRoleModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleCreateRole}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { AccessControl } from "@/components/dashboard/AccessControl";
import DashboardRoleModal from "@/components/dashboard/DashboardRoleModal";
import type { DashboardRoleModalSubmitValues } from "@/components/dashboard/DashboardRoleModal";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { getAdminRoles, getAdminRoleModules, createAdminRole, updateAdminRole, deleteAdminRole } from "@/services/admin/adminUsersService";
import type { AdminRole, AdminRoleModule, AdminRolePermissions } from "@/components/dashboard/AccessControl/types";

export default function AccessControlPage() {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number>();

  const { data: rolesResponse, isLoading: rolesLoading } = useSWR("/admin/roles/", getAdminRoles);
  const { data: modulesResponse, isLoading: modulesLoading } = useSWR("/admin/roles/modules/", getAdminRoleModules);

  const roles: AdminRole[] = rolesResponse?.results || [];
  const modules: AdminRoleModule[] = modulesResponse || [];

  const handleCreateRole = async ({ name, permissions }: DashboardRoleModalSubmitValues) => {
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const response = await createAdminRole({ name, slug, permissions });
      await mutate("/admin/roles/");
      setSelectedRoleId(response.id);
      setRoleModalOpen(false);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.slug ? error.response.data.slug : "Failed to create role";
      alert(msg);
    }
  };

  const handleSavePermissions = async (roleId: number, permissions: AdminRolePermissions) => {
    await updateAdminRole(roleId, { permissions });
    await mutate("/admin/roles/");
  };

  const handleDeleteRole = async (roleId: number) => {
    await deleteAdminRole(roleId);
    if (selectedRoleId === roleId) {
      setSelectedRoleId(undefined);
    }
    await mutate("/admin/roles/");
  };

  const isLoading = rolesLoading || modulesLoading;

  return (
    <>
      <DashboardNavbar onPrimaryAction={() => setRoleModalOpen(true)} />

      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading access control...</div>
      ) : (
        <AccessControl
          roles={roles}
          modules={modules}
          selectedRoleId={selectedRoleId}
          onSelectedRoleChange={setSelectedRoleId}
          onSavePermissions={handleSavePermissions}
          onDeleteRole={handleDeleteRole}
        />
      )}

      <DashboardRoleModal
        open={roleModalOpen}
        modules={modules}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleCreateRole}
      />
    </>
  );
}

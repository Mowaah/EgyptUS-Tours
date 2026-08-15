"use client";

import { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import type { DashboardFormModalField } from "@/components/dashboard/DashboardFormModal";
import DashboardFormModal from "@/components/dashboard/DashboardFormModal";
import { UserManagement } from "@/components/dashboard/UserManagement";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import type { AdminUserRow, AdminRoleRow } from "@/components/dashboard/UserManagement/types";
import {
  getAdminRoles,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/services/admin/adminUsersService";

type ModalMode = "create" | "edit";
type ConfirmationAction = "activate" | "deactivate" | "delete";

interface AdminFormValues {
  id?: number;
  full_name: string;
  email: string;
  role_id: string;
  is_active: "true" | "false" | "";
}

const emptyAdminForm: AdminFormValues = {
  full_name: "",
  email: "",
  role_id: "",
  is_active: "true",
};

export default function UserManagementPage() {
  const { data: rolesResponse, isLoading: rolesLoading } = useSWR(
    "/admin/roles/",
    () => getAdminRoles()
  );

  const roles: AdminRoleRow[] = rolesResponse?.results || [];

  const roleOptions = useMemo(() => roles.map(r => r.name), [roles]);
  const stateOptions = ["Active", "Inactive"];

  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    action: ConfirmationAction;
    user: AdminUserRow;
  } | null>(null);
  const [formValues, setFormValues] = useState<AdminFormValues>(emptyAdminForm);
  const [initialFormValues, setInitialFormValues] = useState<AdminFormValues | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openCreateModal = () => {
    setModalMode("create");
    setFormValues(emptyAdminForm);
    setInitialFormValues(null);
    setModalOpen(true);
  };

  const openEditModal = (user: AdminUserRow) => {
    setModalMode("edit");
    const values: AdminFormValues = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id?.toString() || "",
      is_active: user.is_active ? "true" : "false",
    };
    setFormValues(values);
    setInitialFormValues(values);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);
  const closeConfirmationModal = () => setConfirmation(null);

  const openStatusConfirmation = (user: AdminUserRow) => {
    setConfirmation({
      action: user.is_active ? "deactivate" : "activate",
      user,
    });
  };

  const openDeleteConfirmation = (user: AdminUserRow) => {
    setConfirmation({ action: "delete", user });
  };

  const fields = useMemo<DashboardFormModalField[]>(
    () => [
      {
        id: "full_name",
        label: "Name",
        type: "text",
        placeholder: modalMode === "edit" ? undefined : "Enter Full name",
        value: formValues.full_name,
        required: true,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: modalMode === "edit" ? undefined : "Enter user email",
        value: formValues.email,
        required: true,
      },
      {
        id: "role_id",
        label: "Role",
        type: "select",
        placeholder: "Select a role",
        value: formValues.role_id ? roles.find(r => r.id.toString() === formValues.role_id)?.name || "" : "",
        options: roleOptions,
        required: true,
      },
      {
        id: "is_active",
        label: "State",
        type: "select",
        placeholder: "Select state",
        value: formValues.is_active === "true" ? "Active" : (formValues.is_active === "false" ? "Inactive" : ""),
        options: stateOptions,
        required: true,
      },
    ],
    [formValues, modalMode, roleOptions, roles]
  );

  const handleFieldChange = (fieldId: string, value: string) => {
    if (fieldId === "role_id") {
      const selectedRole = roles.find(r => r.name === value);
      setFormValues((current) => ({ ...current, role_id: selectedRole ? selectedRole.id.toString() : "" }));
    } else if (fieldId === "is_active") {
      setFormValues((current) => ({ ...current, is_active: value === "Active" ? "true" : "false" }));
    } else {
      setFormValues((current) => ({ ...current, [fieldId]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        full_name: formValues.full_name,
        email: formValues.email,
        role_id: parseInt(formValues.role_id, 10),
        is_active: formValues.is_active === "true",
      };

      if (modalMode === "create") {
        await createAdminUser(payload);
      } else if (modalMode === "edit" && formValues.id) {
        await updateAdminUser(formValues.id, payload);
      }
      await mutate(
        (key: any) => Array.isArray(key) && key[0] === "/admin/users/",
        undefined,
        { revalidate: true }
      );
      closeModal();
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmation) return;
    
    try {
      if (confirmation.action === "delete") {
        await deleteAdminUser(confirmation.user.id);
      } else {
        const isActivating = confirmation.action === "activate";
        await updateAdminUser(confirmation.user.id, { is_active: isActivating });
      }
      await mutate(
        (key: any) => Array.isArray(key) && key[0] === "/admin/users/",
        undefined,
        { revalidate: true }
      );
      closeConfirmationModal();
    } catch (error) {
      console.error("Failed to perform action", error);
    }
  };

  const confirmationContent = confirmation
    ? {
        activate: {
          title: "Activate User Account",
          message: (
            <>
              This user will regain access to the dashboard and
              <br />
              system features.
            </>
          ),
          confirmLabel: "Activate",
        },
        deactivate: {
          title: "Deactivate User Account",
          message: (
            <>
              This user will no longer be able to access the system until
              <br />
              reactivated.
            </>
          ),
          confirmLabel: "Deactivate",
        },
        delete: {
          title: "Delete User",
          message: (
            <>
              Are you sure you want to permanently delete this user?
              <br />
              This action cannot be undone.
            </>
          ),
          confirmLabel: "Delete",
        },
      }[confirmation.action]
    : null;

  const hasChanges =
    modalMode === "create" ||
    (initialFormValues &&
      (formValues.full_name !== initialFormValues.full_name ||
        formValues.email !== initialFormValues.email ||
        formValues.role_id !== initialFormValues.role_id ||
        formValues.is_active !== initialFormValues.is_active));

  return (
    <>
      <DashboardNavbar 
        onPrimaryAction={openCreateModal} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {rolesLoading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading roles...</div>
      ) : (
        <UserManagement
          roles={roles}
          searchQuery={searchQuery}
          onEditUser={openEditModal}
          onToggleUserStatus={openStatusConfirmation}
          onDeleteUser={openDeleteConfirmation}
        />
      )}

      <DashboardFormModal
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Add admin user" : "Edit user"}
        subtitle={
          modalMode === "create"
            ? "Create a new admin account."
            : "Update the admin account details."
        }
        fields={fields}
        primaryLabel={modalMode === "create" ? "Create Admin" : "Save Admin"}
        primaryDisabled={modalMode === "edit" && !hasChanges}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
      />

      {confirmationContent ? (
        <DashboardConfirmationModal
          open={Boolean(confirmation)}
          variant={confirmation?.action}
          title={confirmationContent.title}
          message={confirmationContent.message}
          confirmLabel={confirmationContent.confirmLabel}
          onClose={closeConfirmationModal}
          onConfirm={handleConfirmAction}
        />
      ) : null}
    </>
  );
}

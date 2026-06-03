"use client";

import { useMemo, useState } from "react";
import type { DashboardFormModalField } from "@/components/dashboard/DashboardFormModal";
import DashboardFormModal from "@/components/dashboard/DashboardFormModal";
import { UserManagement } from "@/components/dashboard/UserManagement";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import { DashboardConfirmationModal } from "@/components/shared";
import type { AdminRole, AdminState, AdminUserRow } from "@/components/dashboard/UserManagement/types";
import styles from "../../page.module.scss";

type ModalMode = "create" | "edit";
type ConfirmationAction = "activate" | "deactivate" | "delete";

interface AdminFormValues {
  name: string;
  email: string;
  role: "" | AdminRole;
  state: "" | AdminState;
}

const emptyAdminForm: AdminFormValues = {
  name: "",
  email: "",
  role: "",
  state: "",
};

const roleOptions: AdminRole[] = ["Super Admin", "Operations", "Sales", "Support"];
const stateOptions: AdminState[] = ["Active", "Inactive"];

export default function UserManagementPage() {
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    action: ConfirmationAction;
    user: AdminUserRow;
  } | null>(null);
  const [formValues, setFormValues] = useState<AdminFormValues>(emptyAdminForm);

  const openCreateModal = () => {
    setModalMode("create");
    setFormValues(emptyAdminForm);
    setModalOpen(true);
  };

  const openEditModal = (user: AdminUserRow) => {
    setModalMode("edit");
    setFormValues({
      name: user.name,
      email: user.email,
      role: user.role,
      state: user.state,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);
  const closeConfirmationModal = () => setConfirmation(null);

  const openStatusConfirmation = (user: AdminUserRow) => {
    setConfirmation({
      action: user.state === "Active" ? "deactivate" : "activate",
      user,
    });
  };

  const openDeleteConfirmation = (user: AdminUserRow) => {
    setConfirmation({ action: "delete", user });
  };

  const fields = useMemo<DashboardFormModalField[]>(
    () => [
      {
        id: "name",
        label: "Name",
        type: "text",
        placeholder: modalMode === "edit" ? undefined : "Enter Full name",
        value: formValues.name,
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
        id: "role",
        label: "Role",
        type: "select",
        placeholder: "Select a role",
        value: formValues.role,
        options: roleOptions,
        required: true,
      },
      {
        id: "state",
        label: "State",
        type: "select",
        placeholder: "Select state",
        value: formValues.state,
        options: stateOptions,
        required: true,
      },
    ],
    [formValues, modalMode]
  );

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues((current) => ({ ...current, [fieldId]: value }));
  };

  const handleSubmit = () => {
    closeModal();
  };

  const handleConfirmAction = () => {
    closeConfirmationModal();
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

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="User management content">
        <DashboardNavbar onPrimaryAction={openCreateModal} />
        <UserManagement
          onEditUser={openEditModal}
          onToggleUserStatus={openStatusConfirmation}
          onDeleteUser={openDeleteConfirmation}
        />
      </section>

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
    </main>
  );
}

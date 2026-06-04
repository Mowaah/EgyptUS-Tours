"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FilterSelect, TablePanel } from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal, DashboardStatusBanner } from "@/components/shared";
import styles from "./AccessControl.module.scss";

type PermissionKey = "view" | "create" | "edit";

interface PermissionRow {
  module: string;
  permissions: Record<PermissionKey, boolean>;
}

const modules: PermissionRow[] = [
  { module: "Dashboard", permissions: { view: true, create: true, edit: true } },
  { module: "Leads", permissions: { view: false, create: false, edit: false } },
  { module: "Bookings", permissions: { view: false, create: false, edit: false } },
  { module: "Requests", permissions: { view: false, create: false, edit: false } },
  { module: "Customers", permissions: { view: true, create: true, edit: true } },
  { module: "Catalog", permissions: { view: false, create: false, edit: false } },
  { module: "Finance", permissions: { view: true, create: false, edit: true } },
  { module: "Marketing", permissions: { view: true, create: false, edit: true } },
  { module: "Reviews", permissions: { view: true, create: false, edit: true } },
  { module: "Reports & Analytics", permissions: { view: true, create: false, edit: true } },
  { module: "Communications", permissions: { view: true, create: false, edit: true } },
  { module: "Settings", permissions: { view: true, create: false, edit: true } },
  { module: "Legal & Help Center", permissions: { view: true, create: true, edit: true } },
  { module: "SEO Settings", permissions: { view: true, create: true, edit: true } },
];

const roles = ["Super Admin", "Operations", "Sales", "Support"];
const permissionColumns: { key: PermissionKey; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
];
const saveSuccessMessage = "The changes made to this role have been saved successfully.";

interface AccessControlProps {
  customRoles?: string[];
  selectedRole?: string;
  onSelectedRoleChange?: (role: string) => void;
}

function PermissionToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    >
      <span aria-hidden />
    </button>
  );
}

export default function AccessControl({
  customRoles = [],
  selectedRole,
  onSelectedRoleChange,
}: AccessControlProps) {
  const [permissions, setPermissions] = useState(modules);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saveNoticeState, setSaveNoticeState] = useState<"hidden" | "visible" | "leaving">(
    "hidden"
  );
  const [saveNoticeTick, setSaveNoticeTick] = useState(0);
  const roleOptions = useMemo(
    () => [...roles, ...customRoles],
    [customRoles]
  );
  const visibleRole = selectedRole ?? customRoles.at(-1) ?? roles[0];

  useEffect(() => {
    if (saveNoticeState === "hidden") return;

    const timeout = window.setTimeout(
      () => {
        setSaveNoticeState(saveNoticeState === "visible" ? "leaving" : "hidden");
      },
      saveNoticeState === "visible" ? 2800 : 260
    );

    return () => window.clearTimeout(timeout);
  }, [saveNoticeState, saveNoticeTick]);

  const togglePermission = (moduleName: string, key: PermissionKey) => {
    setPermissions((current) =>
      current.map((row) =>
        row.module === moduleName
          ? {
              ...row,
              permissions: {
                ...row.permissions,
                [key]: !row.permissions[key],
              },
            }
          : row
      )
    );
  };

  const handleSavePermissions = () => {
    setSaveNoticeState("visible");
    setSaveNoticeTick((current) => current + 1);
  };

  const handleConfirmDeleteRole = () => {
    setDeleteModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <TablePanel
        ariaLabel="Role permissions editor"
        title="Role Editor"
        iconSrc="/images/dashboard/user-edit.svg"
        className={styles.panel}
        toolbar={
          <div className={styles.toolbarStack}>
            {saveNoticeState !== "hidden" ? (
              <DashboardStatusBanner
                message={saveSuccessMessage}
                leaving={saveNoticeState === "leaving"}
              />
            ) : null}

            <div className={styles.roleToolbar}>
              <FilterSelect
                id="role-editor"
                label="Role"
                value={visibleRole}
                options={roleOptions}
                onChange={(role) => onSelectedRoleChange?.(role)}
              />

              <div className={styles.toolbarActions}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete Role
                  <Image
                    src="/images/dashboard/delete.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden
                  />
                </button>
                <button type="button" className={styles.saveButton} onClick={handleSavePermissions}>
                  Save Permissions
                  <Image
                    src="/images/dashboard/save.svg"
                    alt=""
                    width={22}
                    height={22}
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </div>
        }
      >
        <div className={styles.tableWrap}>
          <table className={styles.permissionsTable}>
            <thead>
              <tr>
                <th scope="col">Module</th>
                {permissionColumns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((row) => (
                <tr key={row.module}>
                  <th scope="row">{row.module}</th>
                  {permissionColumns.map((column) => (
                    <td key={column.key}>
                      <PermissionToggle
                        checked={row.permissions[column.key]}
                        label={`${column.label} ${row.module}`}
                        onChange={() => togglePermission(row.module, column.key)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TablePanel>

      <DashboardConfirmationModal
        open={deleteModalOpen}
        variant="delete"
        title="Delete Role"
        message={
          <>
            Are you sure you want to permanently delete this role from the system? Users assigned
            to this role may lose their current access permissions.
          </>
        }
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteRole}
      />
    </div>
  );
}

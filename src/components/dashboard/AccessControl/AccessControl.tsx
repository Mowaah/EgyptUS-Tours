"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FilterSelect, TablePanel } from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal, DashboardStatusBanner } from "@/components/dashboard/shared";
import type { AdminRole, AdminRoleModule, AdminRolePermissions } from "./types";
import styles from "./AccessControl.module.scss";

interface AccessControlProps {
  roles: AdminRole[];
  modules: AdminRoleModule[];
  selectedRoleId?: number;
  onSelectedRoleChange?: (roleId: number) => void;
  onSavePermissions?: (roleId: number, permissions: AdminRolePermissions) => Promise<void>;
  onDeleteRole?: (roleId: number) => Promise<void>;
}

function PermissionToggle({
  checked,
  label,
  disabled,
  onChange,
}: {
  checked: boolean;
  label: string;
  disabled?: boolean;
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
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <span aria-hidden />
    </button>
  );
}

export default function AccessControl({
  roles,
  modules,
  selectedRoleId,
  onSelectedRoleChange,
  onSavePermissions,
  onDeleteRole,
}: AccessControlProps) {
  const [localPermissions, setLocalPermissions] = useState<AdminRolePermissions>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [showDeleteNotice, setShowDeleteNotice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  const roleOptions = useMemo(() => {
    return roles.map((r) => r.name);
  }, [roles]);

  useEffect(() => {
    if (visibleRole) {
      setLocalPermissions(visibleRole.permissions || {});
    }
  }, [visibleRole]);

  const togglePermission = (moduleKey: string, actionKey: string) => {
    if (visibleRole?.is_super_admin) return; // Super admin has all permissions always
    setLocalPermissions((current) => ({
      ...current,
      [moduleKey]: {
        ...(current[moduleKey] || {}),
        [actionKey]: !current[moduleKey]?.[actionKey],
      },
    }));
  };

  const handleSavePermissions = async () => {
    if (!visibleRole || !onSavePermissions) return;
    setIsSaving(true);
    try {
      await onSavePermissions(visibleRole.id, localPermissions);
      setShowSaveNotice(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteRole = async () => {
    if (!visibleRole || !onDeleteRole) return;
    setIsDeleting(true);
    try {
      await onDeleteRole(visibleRole.id);
      setDeleteModalOpen(false);
      setShowDeleteNotice(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDeleteDisabled = !visibleRole || visibleRole.is_system || visibleRole.users_count > 0;
  const isSuperAdmin = visibleRole?.is_super_admin;

  const hasUnsavedChanges = useMemo(() => {
    if (!visibleRole) return false;
    const original = visibleRole.permissions || {};
    const allModules = new Set([...Object.keys(original), ...Object.keys(localPermissions)]);
    for (const modKey of Array.from(allModules)) {
      const origMod = (original as any)[modKey] || {};
      const localMod = (localPermissions as any)[modKey] || {};
      const allActions = new Set([...Object.keys(origMod), ...Object.keys(localMod)]);
      for (const actKey of Array.from(allActions)) {
        const origVal = !!origMod[actKey];
        const localVal = !!localMod[actKey];
        if (origVal !== localVal) return true;
      }
    }
    return false;
  }, [visibleRole, localPermissions]);

  return (
    <div className={styles.page}>
      <TablePanel
        ariaLabel="Role permissions editor"
        title="Role Editor"
        iconSrc="/images/dashboard/user-edit.svg"
        className={styles.panel}
        alwaysShowToolbar={true}
        toolbar={
          <div className={styles.toolbarStack}>
            <DashboardStatusBanner
              show={showSaveNotice}
              onClose={() => setShowSaveNotice(false)}
              message="The permissions for this role have been saved successfully."
            />
            <DashboardStatusBanner
              show={showDeleteNotice}
              onClose={() => setShowDeleteNotice(false)}
              message="The role has been successfully deleted."
            />

            <div className={styles.roleToolbar}>
              <FilterSelect
                id="role-editor"
                label="Role"
                value={visibleRole?.name || ""}
                options={roleOptions}
                onChange={(roleName) => {
                  const role = roles.find((r) => r.name === roleName);
                  if (role && onSelectedRoleChange) {
                    onSelectedRoleChange(role.id);
                  }
                }}
              />

              <div className={styles.toolbarActions}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={isDeleteDisabled || isDeleting}
                  style={{ opacity: isDeleteDisabled ? 0.5 : 1, cursor: isDeleteDisabled ? "not-allowed" : "pointer" }}
                >
                  {isDeleting ? "Deleting..." : "Delete Role"}
                  <Image
                    src="/images/dashboard/delete.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden
                  />
                </button>
                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={handleSavePermissions}
                  disabled={isSaving || isSuperAdmin || !hasUnsavedChanges}
                  style={{ opacity: (isSuperAdmin || !hasUnsavedChanges) ? 0.5 : 1, cursor: (isSuperAdmin || !hasUnsavedChanges) ? "not-allowed" : "pointer" }}
                >
                  {isSaving ? "Saving..." : "Save Permissions"}
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
                <th scope="col">View</th>
                <th scope="col">Create</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr key={mod.key}>
                  <th scope="row">{mod.label}</th>
                  {["view", "create", "edit"].map((actionKey) => {
                    const actionExists = mod.actions.some((a) => a.key === actionKey);
                    const isChecked = isSuperAdmin ? true : !!localPermissions[mod.key]?.[actionKey];
                    return (
                      <td key={actionKey}>
                        {actionExists ? (
                          <PermissionToggle
                            checked={isChecked}
                            label={`${actionKey} ${mod.label}`}
                            onChange={() => togglePermission(mod.key, actionKey)}
                            disabled={isSuperAdmin}
                          />
                        ) : (
                          <span style={{ color: "#999" }}>-</span>
                        )}
                      </td>
                    );
                  })}
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
            Are you sure you want to permanently delete the <strong>{visibleRole?.name}</strong> role from the system?
          </>
        }
        cancelLabel="Cancel"
        confirmLabel="Delete Role"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteRole}
        confirmDisabled={isDeleting}
      />
    </div>
  );
}

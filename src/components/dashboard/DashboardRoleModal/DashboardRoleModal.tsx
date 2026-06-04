"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CheckboxIndicator, DashboardField } from "@/components/shared";
import styles from "./DashboardRoleModal.module.scss";

export interface DashboardRoleModalSubmitValues {
  name: string;
  permissions: string[];
}

export interface DashboardRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: DashboardRoleModalSubmitValues) => void;
}

const permissionOptions = [
  "Dashboard",
  "Leads & Inquiries",
  "Settings",
  "Bookings",
  "Requests",
  "Legal & Help Center",
  "Customers",
  "Catalog",
  "SEO Settings",
  "Access Finance",
  "Marketing",
  "Reviews",
  "Reports & Analytics",
];

const defaultPermissions = new Set(["Leads & Inquiries", "Bookings", "Reports & Analytics"]);

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.closeSvg}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function DashboardRoleModal({ open, onClose, onSubmit }: DashboardRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    ...defaultPermissions,
  ]);

  const resetForm = useCallback(() => {
    setRoleName("");
    setSelectedPermissions([...defaultPermissions]);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, open]);

  if (!open) return null;

  const trimmedRoleName = roleName.trim();

  const togglePermission = (permission: string) => {
    setSelectedPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  };

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={handleClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-role-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <Image
              src="/images/dashboard/user-add.svg"
              alt=""
              width={24}
              height={24}
              className={styles.headerAsset}
              aria-hidden
            />
          </div>
          <div className={styles.headerText}>
            <h2 id="dashboard-role-modal-title">Create New Role</h2>
            <p>Give the role a clear, descriptive name.</p>
          </div>
          <button type="button" className={styles.closeButton} aria-label="Close modal" onClick={handleClose}>
            <CloseIcon />
          </button>
        </header>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            if (!trimmedRoleName) return;
            onSubmit({
              name: trimmedRoleName,
              permissions: selectedPermissions,
            });
            resetForm();
          }}
        >
          <div className={styles.body}>
            <DashboardField
              id="dashboard-role-name"
              variant="modal"
              label="Role name"
              value={roleName}
              placeholder="Enter Role name"
              required
              onChange={(event) => setRoleName(event.target.value)}
            />

            <fieldset className={styles.permissions}>
              <legend>Custom Permissions</legend>
              <div className={styles.permissionGrid}>
                {permissionOptions.map((permission) => {
                  const selected = selectedPermissions.includes(permission);

                  return (
                    <label
                      key={permission}
                      className={`${styles.permissionOption} ${
                        selected ? styles.permissionOptionSelected : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => togglePermission(permission)}
                      />
                      <CheckboxIndicator
                        selected={selected}
                        variant="square"
                        size="lg"
                        className={styles.permissionCheckbox}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 5.625,
                          borderWidth: 1.125,
                          backgroundSize: "13.5px 13.5px",
                        }}
                      />
                      <span>{permission}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <footer className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton} disabled={!trimmedRoleName}>
              Create Role
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CheckboxIndicator } from "@/components/shared";
import { DashboardField } from "@/components/dashboard/shared";;
import type { AdminRoleModule, AdminRolePermissions } from "@/components/dashboard/AccessControl/types";
import styles from "./DashboardRoleModal.module.scss";

export interface DashboardRoleModalSubmitValues {
  name: string;
  permissions: AdminRolePermissions;
}

export interface DashboardRoleModalProps {
  open: boolean;
  modules?: AdminRoleModule[];
  onClose: () => void;
  onSubmit: (values: DashboardRoleModalSubmitValues) => void;
}


function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.closeSvg}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function DashboardRoleModal({ open, onClose, onSubmit, modules = [] }: DashboardRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // Seed default selections when modal opens
  useEffect(() => {
    if (open && modules.length > 0 && selectedModules.length === 0) {
      const defaults = modules.filter(m => ["leads", "bookings", "reports"].includes(m.key)).map(m => m.key);
      if (defaults.length > 0) setSelectedModules(defaults);
    }
  }, [open, modules]);

  const resetForm = useCallback(() => {
    setRoleName("");
    setHasSubmitted(false);
    setSelectedModules([]);
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

  const togglePermission = (moduleKey: string) => {
    setSelectedModules((current) =>
      current.includes(moduleKey)
        ? current.filter((item) => item !== moduleKey)
        : [...current, moduleKey]
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
          noValidate
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            setHasSubmitted(true);
            if (!trimmedRoleName) return;
            
            const permissions: AdminRolePermissions = {};
            selectedModules.forEach(modKey => {
              const mod = modules.find(m => m.key === modKey);
              if (mod) {
                permissions[modKey] = {};
                mod.actions.forEach(a => {
                  permissions[modKey][a.key] = true;
                });
              }
            });

            onSubmit({
              name: trimmedRoleName,
              permissions,
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
              onChange={(event) => {
                setRoleName(event.target.value);
                if (hasSubmitted) setHasSubmitted(false);
              }}
              error={hasSubmitted && !trimmedRoleName ? "This field is required" : undefined}
            />

            <fieldset className={styles.permissions}>
              <legend>Custom Permissions</legend>
              <div className={styles.permissionGrid}>
                {modules.map((mod) => {
                  const selected = selectedModules.includes(mod.key);

                  return (
                    <label
                      key={mod.key}
                      className={`${styles.permissionOption} ${
                        selected ? styles.permissionOptionSelected : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => togglePermission(mod.key)}
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
                      <span>{mod.label}</span>
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
            <button type="submit" className={styles.primaryButton}>
              Create Role
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

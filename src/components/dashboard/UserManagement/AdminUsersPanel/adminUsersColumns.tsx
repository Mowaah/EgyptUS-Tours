import Image from "next/image";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { AdminUserRow } from "../types";
import styles from "./AdminUsersPanel.module.scss";

const roleClass: Record<string, string> = {
  super_admin: styles.roleSuperAdmin,
  operations: styles.roleOperations,
  sales: styles.roleSales,
  support: styles.roleSupport,
};

export const adminUsersColumns: DataTableColumn<AdminUserRow>[] = [
  {
    id: "id",
    header: "User ID",
    cellClassName: styles.idCell,
    render: (row) => row.display_id || `ADMIN-${row.id.toString().padStart(3, '0')}`,
  },
  {
    id: "name",
    header: "Name",
    render: (row) => row.full_name,
  },
  {
    id: "email",
    header: "Email",
    render: (row) => row.email,
  },
  {
    id: "role",
    header: "Role",
    render: (row) => (
      <span className={`${styles.pill} ${roleClass[row.role] || styles.roleDefault}`}>
        <i aria-hidden />
        {row.role_label}
      </span>
    ),
  },
  {
    id: "lastLogin",
    header: "Last Login",
    render: (row) => {
      if (!row.last_login) return "Never";
      return new Date(row.last_login).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    id: "state",
    header: "State",
    render: (row) => (
      <span className={`${styles.pill} ${row.is_active ? styles.stateActive : styles.stateInactive}`}>
        <Image
          src={
            row.is_active
              ? "/images/dashboard/active.svg"
              : "/images/dashboard/inactive.svg"
          }
          alt=""
          width={16}
          height={16}
          className={styles.stateIcon}
          aria-hidden
        />
        {row.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export const createAdminUserRowActions = (
  row: AdminUserRow,
  onEditUser?: (row: AdminUserRow) => void,
  onToggleUserStatus?: (row: AdminUserRow) => void,
  onDeleteUser?: (row: AdminUserRow) => void
) => [
  {
    label: "Edit User",
    iconSrc: "/images/dashboard/edit.svg",
    onClick: onEditUser,
  },
  {
    label: row.is_active ? "Deactivate" : "Activate",
    iconSrc:
      row.is_active
        ? "/images/dashboard/deactivate.svg"
        : "/images/dashboard/activate.svg",
    onClick: onToggleUserStatus,
  },
  {
    label: "Delete User",
    variant: "danger" as const,
    iconSrc: "/images/dashboard/delete.svg",
    onClick: onDeleteUser,
  },
];

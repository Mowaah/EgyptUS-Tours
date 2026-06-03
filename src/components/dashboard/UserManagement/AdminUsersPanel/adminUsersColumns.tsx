import Image from "next/image";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { AdminUserRow } from "../types";
import styles from "./AdminUsersPanel.module.scss";

const roleClass: Record<AdminUserRow["role"], string> = {
  "Super Admin": styles.roleSuperAdmin,
  Operations: styles.roleOperations,
  Sales: styles.roleSales,
  Support: styles.roleSupport,
};

const stateClass: Record<AdminUserRow["state"], string> = {
  Active: styles.stateActive,
  Inactive: styles.stateInactive,
};

export const adminUsersColumns: DataTableColumn<AdminUserRow>[] = [
  {
    id: "id",
    header: "User ID",
    cellClassName: styles.idCell,
    render: (row) => row.id,
  },
  {
    id: "name",
    header: "Name",
    render: (row) => row.name,
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
      <span className={`${styles.pill} ${roleClass[row.role]}`}>
        <i aria-hidden />
        {row.role}
      </span>
    ),
  },
  {
    id: "lastLogin",
    header: "Last Login",
    render: (row) => row.lastLogin,
  },
  {
    id: "state",
    header: "State",
    render: (row) => (
      <span className={`${styles.pill} ${stateClass[row.state]}`}>
        <Image
          src={
            row.state === "Active"
              ? "/images/dashboard/active.svg"
              : "/images/dashboard/inactive.svg"
          }
          alt=""
          width={16}
          height={16}
          className={styles.stateIcon}
          aria-hidden
        />
        {row.state}
      </span>
    ),
  },
];

export const adminUserRowActions = (row: AdminUserRow) => [
  { label: "Change Role", iconSrc: "/images/dashboard/convert.svg" },
  {
    label: row.state === "Active" ? "Deactivate" : "Activate",
    iconSrc:
      row.state === "Active"
        ? "/images/dashboard/deactivate.svg"
        : "/images/dashboard/activate.svg",
  },
  {
    label: "Delete User",
    variant: "danger" as const,
    iconSrc: "/images/dashboard/delete.svg",
  },
];

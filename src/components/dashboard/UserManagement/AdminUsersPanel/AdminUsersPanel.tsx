"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import type { AdminUserRow, AdminRoleRow } from "../types";
import { createAdminUserRowActions, adminUsersColumns } from "./adminUsersColumns";

interface AdminUsersPanelProps {
  users: AdminUserRow[];
  roles: AdminRoleRow[];
  searchQuery?: string;
  onEditUser?: (user: AdminUserRow) => void;
  onToggleUserStatus?: (user: AdminUserRow) => void;
  onDeleteUser?: (user: AdminUserRow) => void;
}

export default function AdminUsersPanel({
  users,
  roles,
  searchQuery,
  onEditUser,
  onToggleUserStatus,
  onDeleteUser,
}: AdminUsersPanelProps) {
  const defaultFilters = { role: "All", state: "All" };
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filterOptions = useMemo(() => ({
    role: ["All", ...roles.map(r => r.name)],
    state: ["All", "Active", "Inactive"],
  }), [roles]);

  const normalizedSearchQuery = (searchQuery || "").toLowerCase();

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        if (appliedFilters.role !== "All" && user.role_label !== appliedFilters.role) return false;
        if (appliedFilters.state !== "All") {
          const isActive = appliedFilters.state === "Active";
          if (user.is_active !== isActive) return false;
        }
        if (normalizedSearchQuery) {
          const matchesName = user.full_name?.toLowerCase().includes(normalizedSearchQuery);
          const matchesEmail = user.email?.toLowerCase().includes(normalizedSearchQuery);
          if (!matchesName && !matchesEmail) return false;
        }
        return true;
      }),
    [users, appliedFilters, normalizedSearchQuery]
  );

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filterFields = (
    [
      ["role", "Role", filterOptions.role],
      ["state", "States", filterOptions.state],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof defaultFilters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const rowActions = (row: AdminUserRow) =>
    createAdminUserRowActions(row, onEditUser, onToggleUserStatus, onDeleteUser);

  return (
    <TablePanel
      ariaLabel="Admin users table"
      title="All Admins"
      iconSrc="/images/dashboard/sidebar/user-management.svg"
      showFilters={true}
      showExport={true}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={filteredUsers}
        columns={adminUsersColumns}
        getRowId={(row) => String(row.id)}
        
        rowActions={rowActions}
        defaultPageSize={5}
      />
    </TablePanel>
  );
}

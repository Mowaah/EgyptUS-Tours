"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import type { AdminUserRow, AdminRoleRow } from "../types";
import { createAdminUserRowActions, adminUsersColumns } from "./adminUsersColumns";
import { exportAdminUsers, getAdminUsers } from "@/services/admin/adminUsersService";

interface AdminUsersPanelProps {
  roles: AdminRoleRow[];
  searchQuery?: string;
  onEditUser?: (user: AdminUserRow) => void;
  onToggleUserStatus?: (user: AdminUserRow) => void;
  onDeleteUser?: (user: AdminUserRow) => void;
}

export default function AdminUsersPanel({
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

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: pageIndex + 1,
      page_size: pageSize,
    };
    if (appliedFilters.role !== "All") {
      const roleObj = roles.find(r => r.name === appliedFilters.role);
      if (roleObj) params.role = roleObj.slug;
    }
    if (appliedFilters.state !== "All") {
      params.is_active = appliedFilters.state === "Active" ? "true" : "false";
    }
    if (normalizedSearchQuery) {
      params.search = normalizedSearchQuery;
    }
    return params;
  }, [appliedFilters, normalizedSearchQuery, pageIndex, pageSize, roles]);

  const { data: usersResponse, isLoading } = useSWR(
    ["/admin/users/", queryParams],
    () => getAdminUsers(queryParams)
  );

  const users: AdminUserRow[] = usersResponse?.results || [];
  const totalCount = usersResponse?.count || 0;

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

  const handleExport = async () => {
    try {
      const params: Record<string, string> = {};
      if (appliedFilters.role !== "All") {
        const roleObj = roles.find(r => r.name === appliedFilters.role);
        if (roleObj) params.role = roleObj.slug;
      }
      if (appliedFilters.state !== "All") {
        params.is_active = appliedFilters.state === "Active" ? "true" : "false";
      }
      if (normalizedSearchQuery) {
        params.search = normalizedSearchQuery;
      }
      await exportAdminUsers(params);
    } catch (error) {
      console.error("Failed to export users:", error);
    }
  };

  return (
    <TablePanel
      ariaLabel="Admin users table"
      title="All Admins"
      iconSrc="/images/dashboard/sidebar/user-management.svg"
      showFilters={true}
      showExport={true}
      onExportClick={handleExport}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={users}
        columns={adminUsersColumns}
        getRowId={(row) => String(row.id)}
        rowActions={rowActions}
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
      />
    </TablePanel>
  );
}

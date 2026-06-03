"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockAdminUsers } from "../userManagementData";
import { adminUserRowActions, adminUsersColumns } from "./adminUsersColumns";

const filterOptions = {
  role: ["All", "Super Admin", "Operations", "Sales", "Support"],
  state: ["All", "Active", "Inactive"],
};

export default function AdminUsersPanel() {
  const defaultFilters = { role: "All", state: "All" };
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filteredUsers = useMemo(
    () =>
      mockAdminUsers.filter((user) => {
        if (appliedFilters.role !== "All" && user.role !== appliedFilters.role) return false;
        if (appliedFilters.state !== "All" && user.state !== appliedFilters.state) return false;
        return true;
      }),
    [appliedFilters]
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
    value: filters[id],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  return (
    <TablePanel
      ariaLabel="Admin users table"
      title="Admin Users"
      iconSrc="/images/dashboard/sidebar/user-management.svg"
      headerActions={
        <>
          <TablePanelHeaderButton iconSrc="/images/dashboard/filter.svg">
            Filters
          </TablePanelHeaderButton>
          <TablePanelHeaderButton iconSrc="/images/dashboard/export.svg">
            Export Data
          </TablePanelHeaderButton>
        </>
      }
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={filteredUsers}
        columns={adminUsersColumns}
        getRowId={(row) => row.id}
        selectable
        rowActions={adminUserRowActions}
        defaultPageSize={5}
      />
    </TablePanel>
  );
}

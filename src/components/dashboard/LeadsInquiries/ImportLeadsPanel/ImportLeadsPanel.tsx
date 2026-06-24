import { useState, useMemo } from "react";
import { TablePanel, TablePanelHeaderButton, TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { DataTable } from "@/components/dashboard/DataTable";
import { mockImportLeads } from "../leadsInquiriesData";
import { importLeadsColumns, importRowActions } from "./importLeadsColumns";

const filterOptions = {
  batchId: ["All", "IMP-001", "IMP-002", "IMP-003", "IMP-004", "IMP-005", "IMP-006", "IMP-007", "IMP-008", "IMP-009", "IMP-010"],
  team: ["All", "Operations", "Sales"],
};

export function ImportLeadsPanel() {
  const defaultFilters = {
    batchId: "All",
    team: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filteredLeads = useMemo(
    () =>
      mockImportLeads.filter((row) => {
        if (appliedFilters.batchId !== "All" && row.batchId !== appliedFilters.batchId) return false;
        if (appliedFilters.team !== "All" && !row.assignedTeam.includes(appliedFilters.team as "Operations" | "Sales")) return false;
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
      ["batchId", "Batch ID", filterOptions.batchId],
      ["team", "Team", filterOptions.team],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  return (
    <TablePanel
      ariaLabel="Import Leads table"
      title="Import Leads"
      iconSrc="/images/dashboard/inquiries/inquiries.svg"
      headerActions={
        <>
          <TablePanelHeaderButton iconSrc="/images/dashboard/filter.svg">
            Filters
          </TablePanelHeaderButton>
          <TablePanelHeaderButton iconSrc="/images/dashboard/export.svg">
            Import Data
          </TablePanelHeaderButton>
        </>
      }
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={filteredLeads}
        columns={importLeadsColumns}
        getRowId={(row) => row.batchId}
        selectable
        rowActions={importRowActions}
      />
    </TablePanel>
  );
}

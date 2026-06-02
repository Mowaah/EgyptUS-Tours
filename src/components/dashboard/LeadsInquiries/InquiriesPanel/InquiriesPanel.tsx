"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockLeads } from "../leadsInquiriesData";
import { inquiriesColumns, leadRowActions } from "./inquiriesColumns";

const filterOptions = {
  leadId: ["All", "LD-001", "LD-002", "LD-003"],
  source: ["All", "B2B", "Contact", "MICE", "Plan Your Trip"],
  date: ["All", "2024-03-15", "2024-03-14"],
  status: ["All", "New", "In Progress", "Converted"],
};

export default function InquiriesPanel() {
  const defaultFilters = {
    leadId: "All",
    source: "All",
    date: "All",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filteredLeads = useMemo(
    () =>
      mockLeads.filter((lead) => {
        if (appliedFilters.leadId !== "All" && lead.id !== appliedFilters.leadId) return false;
        if (appliedFilters.source !== "All" && lead.source !== appliedFilters.source) return false;
        if (appliedFilters.date !== "All" && lead.date !== appliedFilters.date) return false;
        if (appliedFilters.status !== "All" && lead.status !== appliedFilters.status) return false;
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
      ["leadId", "Lead ID", filterOptions.leadId],
      ["source", "Source", filterOptions.source],
      ["date", "Date", filterOptions.date],
      ["status", "Status", filterOptions.status],
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
      ariaLabel="Inquiries table"
      title="Inquiries"
      iconSrc="/images/dashboard/inquiries/inquiries.svg"
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
        data={filteredLeads}
        columns={inquiriesColumns}
        getRowId={(row) => row.id}
        selectable
        rowActions={leadRowActions}
        defaultPageSize={5}
      />
    </TablePanel>
  );
}

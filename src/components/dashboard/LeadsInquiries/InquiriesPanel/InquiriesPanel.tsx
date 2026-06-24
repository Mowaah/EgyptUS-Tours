"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockLeads } from "../leadsInquiriesData";
import { inquiriesColumns, leadRowActions } from "./inquiriesColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";

const filterOptions = {
  batchId: ["All", "LD-001", "LD-002", "LD-003"],
  source: ["All", "Phone Call", "Walk-in", "Email", "Whatsup", "Facebook"],
  date: ["All", "2024-03-15", "2024-03-14"],
  status: ["All", "New", "Closed", "Qualified", "Converted", "Contacted"],
  assigned: ["All", "Sara M.", "Unassigned"],
};

interface InquiriesPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onEditLead?: (lead: any) => void;
  onAddLead?: () => void;
}

export default function InquiriesPanel({ searchQuery = "", onClearSearch, onEditLead, onAddLead }: InquiriesPanelProps) {
  const router = useRouter();
  
  const defaultFilters = {
    batchId: "All",
    source: "All",
    date: "All",
    status: "All",
    assigned: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filteredLeads = useMemo(
    () =>
      mockLeads.filter((lead) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (!lead.name.toLowerCase().includes(lowerQuery) &&
              !lead.email.toLowerCase().includes(lowerQuery) &&
              !lead.id.toLowerCase().includes(lowerQuery)) {
            return false;
          }
        }
        if (appliedFilters.batchId !== "All" && lead.id !== appliedFilters.batchId) return false;
        if (appliedFilters.source !== "All" && lead.source !== appliedFilters.source) return false;
        if (appliedFilters.date !== "All" && lead.date !== appliedFilters.date) return false;
        if (appliedFilters.status !== "All" && lead.status !== appliedFilters.status) return false;
        if (appliedFilters.assigned !== "All" && lead.agent !== appliedFilters.assigned) return false;
        return true;
      }),
    [appliedFilters, searchQuery]
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
      ["source", "Source", filterOptions.source],
      ["date", "Date", filterOptions.date],
      ["status", "Status", filterOptions.status],
      ["assigned", "Assigned", filterOptions.assigned],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  if (mockLeads.length > 0 && filteredLeads.length === 0) {
    return (
      <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />
    );
  }

  if (mockLeads.length === 0) {
    return (
      <DashboardEmptyState
        title="No Leads Yet"
        subtitle="Leads will appear here once they are added or imported."
        actionLabel="Add New Lead"
        onAction={onAddLead}
        imageSrc="/images/dashboard/empty-folder.svg"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Leads table"
      title="Leads"
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
        rowActions={(row) => leadRowActions((action, r) => {
          if (action === "Edit" && onEditLead) {
            onEditLead(r);
          } else if (action === "View") {
            router.push(`/dashboard/leads/${r.id}`);
          }
        })}
        defaultPageSize={5}
      />
    </TablePanel>
  );
}

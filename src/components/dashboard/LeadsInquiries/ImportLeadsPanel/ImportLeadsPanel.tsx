import { useState, useMemo } from "react";
import { TablePanel, TablePanelHeaderButton, TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { DataTable } from "@/components/dashboard/DataTable";
import { mockImportLeads } from "../leadsInquiriesData";
import { importLeadsColumns, importRowActions } from "./importLeadsColumns";
import { ReassignLeadModal } from "../ReassignLeadModal";
import { ViewAssignedMembersModal } from "../ViewAssignedMembersModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";

const filterOptions = {
  batchId: ["All", "IMP-001", "IMP-002", "IMP-003", "IMP-004", "IMP-005", "IMP-006", "IMP-007", "IMP-008", "IMP-009", "IMP-010"],
  team: ["All", "Operations", "Sales"],
};

interface ImportLeadsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onReassignSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onImportLead?: () => void;
}

export function ImportLeadsPanel({ 
  searchQuery = "", 
  onClearSearch, 
  onReassignSuccess, 
  onDeleteSuccess, 
  onImportLead 
}: ImportLeadsPanelProps) {
  const defaultFilters = {
    batchId: "All",
    team: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [viewMembersModalOpen, setViewMembersModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const filteredLeads = useMemo(
    () =>
      mockImportLeads.filter((row) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (!row.batchId.toLowerCase().includes(lowerQuery)) {
            return false;
          }
        }
        if (appliedFilters.batchId !== "All" && row.batchId !== appliedFilters.batchId) return false;
        if (appliedFilters.team !== "All" && !row.assignedTeam.includes(appliedFilters.team as "Operations" | "Sales")) return false;
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
      ["team", "Team", filterOptions.team],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  if (mockImportLeads.length > 0 && filteredLeads.length === 0) {
    return (
      <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />
    );
  }

  if (mockImportLeads.length === 0) {
    return (
      <DashboardEmptyState
        title="No Leads Imported Yet"
        subtitle="Import a batch of leads to start managing and tracking them"
        actionLabel="Import Leads CSV"
        onAction={onImportLead}
        imageSrc="/images/dashboard/empty-folder.svg"
        actionIconSrc="/images/dashboard/export.svg"
      />
    );
  }

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
        rowActions={(row) => importRowActions({
          onView: () => setViewMembersModalOpen(true),
          onReassign: () => setReassignModalOpen(true),
          onDelete: () => setDeleteModalOpen(true)
        })}
      />

      <ReassignLeadModal 
        open={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        onSuccess={() => {
          setReassignModalOpen(false);
          onReassignSuccess?.();
        }}
      />

      <ViewAssignedMembersModal
        open={viewMembersModalOpen}
        onClose={() => setViewMembersModalOpen(false)}
        onReassign={() => {
          setViewMembersModalOpen(false);
          setReassignModalOpen(true);
        }}
      />

      <DashboardConfirmationModal
        open={deleteModalOpen}
        variant="delete"
        title="Delete Batch"
        message={
          <>
            Are you sure you want to delete this batch? <br />
            This action cannot be undone
          </>
        }
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          onDeleteSuccess?.();
        }}
      />
    </TablePanel>
  );
}

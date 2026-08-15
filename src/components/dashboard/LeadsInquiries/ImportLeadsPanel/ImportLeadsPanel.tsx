import { useState, useMemo } from "react";
import { TablePanel, TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { DataTable } from "@/components/dashboard/DataTable";
import { importLeadsColumns, importRowActions } from "./importLeadsColumns";
import { ReassignModal } from "@/components/dashboard/shared";
import { ViewAssignedMembersModal } from "../ViewAssignedMembersModal";
import { useLeadImportBatches, useDeleteLeadImportBatch, useReassignLeadImportBatch } from "@/hooks/useLeadImportBatches";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import type { AdminLeadImportBatch } from "@/types/adminLeadTypes";
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
  const [selectedBatch, setSelectedBatch] = useState<AdminLeadImportBatch | null>(null);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [viewMembersModalOpen, setViewMembersModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: batchesData, isLoading } = useLeadImportBatches({ page, page_size: pageSize });
  const deleteBatchMutation = useDeleteLeadImportBatch();

  const { data: usersData } = useAdminUsers({ limit: 100 });
  const users = usersData?.results || [];
  const getImageUrl = (path?: string) => {
    if (!path) return "/images/dashboard/sara.jpg";
    if (path.startsWith("http")) return path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${apiUrl}${path}`;
  };

  const agents = users.map((u: any) => ({
    id: u.id.toString(),
    name: u.full_name,
    avatarSrc: getImageUrl(u.profile_picture),
  }));

  const reassignBatchMutation = useReassignLeadImportBatch();

  const leadsList: AdminLeadImportBatch[] = batchesData?.results || [];

  const filteredLeads = useMemo(
    () =>
      leadsList.filter((row) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (!row.batch_code.toLowerCase().includes(lowerQuery)) {
            return false;
          }
        }
        if (appliedFilters.batchId !== "All" && row.batch_code !== appliedFilters.batchId) return false;
        if (appliedFilters.team !== "All" && row.assigned_teams && !row.assigned_teams.includes(appliedFilters.team.toLowerCase())) return false;
        return true;
      }),
    [leadsList, appliedFilters, searchQuery]
  );

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    onClearSearch?.();
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (leadsList.length > 0 && filteredLeads.length === 0) {
    return (
      <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />
    );
  }

  if (leadsList.length === 0) {
    return (
      <DashboardEmptyState
        title="No Leads Imported Yet"
        subtitle="Import a batch of leads to start managing and tracking them"
        actionLabel="Import Leads CSV"
        onAction={onImportLead}
        imageSrc="/images/dashboard/empty.png"
        actionIconSrc="/images/dashboard/export.svg"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Import Leads table"
      title="Import Leads"
      iconSrc="/images/dashboard/inquiries/inquiries.svg"
      showFilters
      showExport
      exportLabel="Import Data"
      onExportClick={onImportLead}
      toolbar={
        <TablePanelFilterBar
          fields={[
            {
              id: "batchId",
              label: "Batch ID",
              options: ["All", ...Array.from(new Set(leadsList.map(l => l.batch_code)))],
              value: filters.batchId,
              onChange: (value: string) => setFilters({ ...filters, batchId: value }),
            },
            {
              id: "team",
              label: "Team",
              options: filterOptions.team,
              value: filters.team,
              onChange: (value: string) => setFilters({ ...filters, team: value }),
            },
          ]}
          onClean={resetFilters}
          onApply={applyFilters}
        />
      }
    >
      <DataTable
        data={filteredLeads}
        columns={importLeadsColumns as any}
        getRowId={(row) => row.id.toString()}
        serverSidePagination={true}
        totalCount={batchesData?.count || 0}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
        rowActions={(row) => importRowActions({
          onView: () => {
            setSelectedBatch(row as any);
            setViewMembersModalOpen(true);
          },
          onReassign: () => {
            setSelectedBatch(row as any);
            setReassignModalOpen(true);
          },
          onDelete: () => {
            setSelectedBatch(row as any);
            setDeleteModalOpen(true);
          }
        })}
      />

      <ReassignModal 
        open={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        agents={agents}
        onConfirm={(agentId) => {
          if (selectedBatch) {
            reassignBatchMutation.mutate({ id: selectedBatch.id, memberId: parseInt(agentId) }, {
              onSuccess: () => {
                setReassignModalOpen(false);
                onReassignSuccess?.();
              }
            });
          }
        }}
      />

      <ViewAssignedMembersModal
        open={viewMembersModalOpen}
        onClose={() => setViewMembersModalOpen(false)}
        onReassign={() => {
          setViewMembersModalOpen(false);
          setReassignModalOpen(true);
        }}
        batchId={selectedBatch?.id}
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
          if (selectedBatch) {
            deleteBatchMutation.mutate(selectedBatch.id, {
              onSuccess: () => {
                setDeleteModalOpen(false);
                onDeleteSuccess?.();
              }
            });
          }
        }}
      />
    </TablePanel>
  );
}

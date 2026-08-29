"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { useLeads, useAssignLead, useExportLeads } from "@/hooks/useLeads";
import { inquiriesColumns, leadRowActions } from "./inquiriesColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { ReassignModal } from "@/components/dashboard/shared";
import { useAdminUsers } from "@/hooks/useAdminUsers";

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
  const [isExporting, setIsExporting] = useState(false);
  
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: usersData } = useAdminUsers({ limit: 100 });
  const users = usersData?.results || [];

  const queryParams = useMemo(() => {
    const params: any = {
      page: pageIndex + 1,
      page_size: pageSize,
    };
    if (searchQuery) params.search = searchQuery;
    if (appliedFilters.batchId !== "All") params.batch_code = appliedFilters.batchId;
    if (appliedFilters.source !== "All") {
      let src = appliedFilters.source.toLowerCase().replace(" ", "_").replace("-", "_");
      if (src === "whatsup") src = "whatsapp";
      params.source = src;
    }
    if (appliedFilters.status !== "All") params.status = appliedFilters.status.toLowerCase();
    if (appliedFilters.assigned !== "All") {
      if (appliedFilters.assigned === "Unassigned") {
        params.assigned_to = "null";
      } else {
        const user = users.find((u: any) => u.full_name === appliedFilters.assigned);
        if (user) params.assigned_to = user.id;
      }
    }
    if (appliedFilters.date !== "All") {
      params.date_from = appliedFilters.date;
      params.date_to = appliedFilters.date;
    }
    return params;
  }, [pageIndex, pageSize, searchQuery, appliedFilters, users]);

  const { data: leadsData, isLoading } = useLeads(queryParams);
  const leadsList = leadsData?.results || [];
  const totalCount = leadsData?.count || 0;
  
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

  const assignLeadMutation = useAssignLead();
  const exportLeadsMutation = useExportLeads();

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    onClearSearch?.();
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filterFields = (
    [
      ["batchId", "Batch ID", ["All", ...Array.from(new Set(leadsList.map((l: any) => l.batch_code).filter(Boolean)))]],
      ["source", "Source", filterOptions.source],
      ["date", "Date", filterOptions.date],
      ["status", "Status", filterOptions.status],
      ["assigned", "Assigned", ["All", ...Array.from(new Set(leadsList.map((l: any) => l.assigned_to?.full_name).filter(Boolean)))]],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options: options as string[],
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));



  return (
    <TablePanel
      ariaLabel="Leads table"
      title="Leads"
      iconSrc="/images/dashboard/inquiries/inquiries.svg"
      showFilters
      showExport
      onExportClick={() => {
        setIsExporting(true);
        exportLeadsMutation.mutate(
          {}, 
          {
            onSuccess: () => setIsExporting(false),
            onError: (err) => {
              console.error("Export failed:", err);
              setIsExporting(false);
            },
          }
        );
      }}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={leadsList}
        columns={inquiriesColumns}
        getRowId={(row) => row.id.toString()}
        rowActions={() => leadRowActions((action, r) => {
          if (action === "Edit" && onEditLead) {
            onEditLead(r);
          } else if (action === "View") {
            router.push(`/dashboard/leads/${r.id}`);
          } else if (action === "Assign to Lead") {
            setSelectedLead(r);
            setAssignModalOpen(true);
          }
        })}
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
        isLoading={isLoading}
        onClearSearch={onClearSearch || resetFilters}
        emptyState={
          !searchQuery && Object.values(appliedFilters).every((v) => v === "All") ? (
            <DashboardEmptyState
              title="No Leads Yet"
              subtitle="Leads will appear here once they are added or imported."
              actionLabel="Add New Lead"
              onAction={onAddLead}
              imageSrc="/images/dashboard/empty.png"
            />
          ) : !searchQuery && Object.values(appliedFilters).some((v) => v !== "All") ? (
              <DashboardFilterEmptyState
                onClearFilters={onClearSearch || resetFilters}
                title="No Results Found"
                subtitle="No results match the selected filters."
              />
            ) : undefined
        }
      />
      
      <ReassignModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        agents={agents}
        onConfirm={(agentId) => {
          if (selectedLead) {
            assignLeadMutation.mutate({ id: selectedLead.id, userId: parseInt(agentId) }, {
              onSuccess: () => {
                setAssignModalOpen(false);
              }
            });
          }
        }}
      />
    </TablePanel>
  );
}

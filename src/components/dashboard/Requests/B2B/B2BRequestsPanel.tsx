"use client";

import { useMemo, useState, useEffect } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { b2bColumns, B2BApiItem } from "./b2bColumns";
import { getAllB2BRequests } from "@/lib/adminApi";

interface B2BRequestsPanelProps {
  searchQuery?: string;
}

export default function B2BRequestsPanel({ searchQuery = "" }: B2BRequestsPanelProps) {
  const [data, setData] = useState<B2BApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (sourceFilter && sourceFilter !== "All") params.source = sourceFilter.toLowerCase();
      if (statusFilter && statusFilter !== "All") params.status = statusFilter.toLowerCase().replace(/ /g, "_");
      params.page_size = 100;

      const results = await getAllB2BRequests(params);
      setData(results);
    } catch (err) {
      console.error("Failed to fetch B2B requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [searchQuery, sourceFilter, statusFilter]);

  const filterFields = useMemo(
    () => [
      {
        id: "source",
        label: "Source",
        value: sourceFilter || "All",
        options: ["All", "Website", "Agent"],
        onChange: (val: string) => setSourceFilter(val),
      },
      {
        id: "status",
        label: "Status",
        value: statusFilter || "All",
        options: [
          "All",
          "New",
          "In Progress",
          "Proposal Ready",
          "Proposal Sent",
          "Rejected",
          "Negotiation",
          "Pending Payment",
          "Deposit Paid",
          "Fully Paid",
          "In Trip",
          "Completed",
          "Cancelled",
          "Refund Completed",
        ],
        onChange: (val: string) => setStatusFilter(val),
      },
    ],
    [sourceFilter, statusFilter]
  );

  const handleClean = () => {
    setSourceFilter("");
    setStatusFilter("");
  };

  if (!loading && data.length === 0 && !searchQuery && !sourceFilter && !statusFilter) {
    return (
      <DashboardEmptyState
        title="No B2B Requests Yet"
        subtitle="B2B requests will appear here once users start submitting them"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="B2B requests"
      title="B2B Corporate Proposals"
      iconSrc="/images/dashboard/sidebar/b2b-programs.svg"
      showFilters
      showExport
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={handleClean} onApply={() => {}} />}
    >
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading requests...</div>
      ) : data.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>No requests found for your filters.</div>
      ) : (
        <DataTable
          data={data}
          columns={b2bColumns}
          getRowId={(row) => row.id.toString()}
          selectable
        />
      )}
    </TablePanel>
  );
}

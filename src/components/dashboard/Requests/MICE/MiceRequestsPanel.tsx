"use client";

import { useMemo, useState, useEffect } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { miceColumns } from "./miceColumns";
import { getAllMiceRequests } from "@/lib/adminApi";
import { buildRequestFilterParams, downloadBlobAsCSV } from "@/lib/utils";

interface MiceRequestsPanelProps {
  searchQuery?: string;
}

export default function MiceRequestsPanel({ searchQuery = "" }: MiceRequestsPanelProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedSourceFilter, setAppliedSourceFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const params = buildRequestFilterParams(searchQuery, appliedSourceFilter, appliedStatusFilter);
        params.page_size = 100;
        
        const results = await getAllMiceRequests(params);
        setData(results);
      } catch (err) {
        console.error("Failed to fetch MICE requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [searchQuery, appliedSourceFilter, appliedStatusFilter]);

  const handleApply = () => {
    setAppliedSourceFilter(sourceFilter);
    setAppliedStatusFilter(statusFilter);
  };

  const handleExport = async () => {
    try {
      const params = buildRequestFilterParams(searchQuery, appliedSourceFilter, appliedStatusFilter);
      const { exportMiceCSV } = await import("@/lib/adminApi");
      const blob = await exportMiceCSV(params);
      downloadBlobAsCSV(blob, "mice_requests.csv");
    } catch (err) {
      console.error("Failed to export:", err);
    }
  };

  const handleClean = () => {
    setSourceFilter("");
    setStatusFilter("");
    setAppliedSourceFilter("");
    setAppliedStatusFilter("");
  };

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
          "30% Pending Payment",
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

  if (loading) {
    return (
      <TablePanel
        ariaLabel="MICE requests"
        title="MICE & Corporate Request"
        iconSrc="/images/dashboard/sidebar/mice-corporate.svg"
      >
        <div style={{ padding: "40px", textAlign: "center" }}>Loading MICE Requests...</div>
      </TablePanel>
    );
  }

  if (!loading && data.length === 0 && !searchQuery && !appliedSourceFilter && !appliedStatusFilter) {
    return (
      <DashboardEmptyState
        title="No MICE & Corporate Requests Yet"
        subtitle="MICE requests will appear here once users start submitting them"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="MICE requests"
      title="MICE & Corporate Request"
      iconSrc="/images/dashboard/sidebar/mice-corporate.svg"
      showFilters
      showExport
      onExportClick={handleExport}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={handleClean} onApply={handleApply} />}
    >
      <DataTable
        data={data}
        columns={miceColumns}
        getRowId={(row) => row.id}
        selectable
      />
    </TablePanel>
  );
}

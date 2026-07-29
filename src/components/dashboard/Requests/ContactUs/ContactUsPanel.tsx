"use client";

import { useMemo, useState, useEffect } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { contactUsColumns } from "./contactUsColumns";
import { getAllContactUsRequests, exportContactUsCSV } from "@/lib/adminApi";
import { buildRequestFilterParams, downloadBlobAsCSV } from "@/lib/utils";

interface ContactUsPanelProps {
  searchQuery?: string;
}

export default function ContactUsPanel({ searchQuery = "" }: ContactUsPanelProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const params = buildRequestFilterParams(searchQuery, undefined, appliedStatusFilter);
        params.page_size = 100;
        
        const results = await getAllContactUsRequests(params);
        setData(results);
      } catch (err) {
        console.error("Failed to fetch Contact Us requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [searchQuery, appliedStatusFilter]);

  const handleApply = () => {
    setAppliedStatusFilter(statusFilter);
  };

  const handleClean = () => {
    setStatusFilter("");
    setAppliedStatusFilter("");
  };

  const handleExport = async () => {
    try {
      const params = buildRequestFilterParams(searchQuery, undefined, appliedStatusFilter);
      const blob = await exportContactUsCSV(params);
      downloadBlobAsCSV(blob, "contact_us.csv");
    } catch (err) {
      console.error("Failed to export:", err);
    }
  };

  const filterFields = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        value: statusFilter || "All",
        options: [
          "All",
          "New",
          "Replied",
          "Closed",
        ],
        onChange: (val: string) => setStatusFilter(val),
      },
    ],
    [statusFilter]
  );

  if (loading) {
    return (
      <TablePanel
        ariaLabel="Contact Us messages"
        title="Contact Us"
        iconSrc="/images/dashboard/sidebar/contact-us.svg"
      >
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Loading requests...
        </div>
      </TablePanel>
    );
  }

  if (data.length === 0 && !searchQuery && !appliedStatusFilter) {
    return (
      <DashboardEmptyState
        title="No Contact Us Messages Yet"
        subtitle="Messages from customers will appear here."
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Contact Us messages"
      title="Contact Us"
      iconSrc="/images/dashboard/sidebar/contact-us.svg"
      showFilters
      showExport
      onExportClick={handleExport}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={handleClean} onApply={handleApply} />}
    >
      {data.length > 0 ? (
        <DataTable
          data={data}
          columns={contactUsColumns}
          getRowId={(row) => row.id}
          selectable
        />
      ) : (
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          No requests found matching your filters.
        </div>
      )}
    </TablePanel>
  );
}

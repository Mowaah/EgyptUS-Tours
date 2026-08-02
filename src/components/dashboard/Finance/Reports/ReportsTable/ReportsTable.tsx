"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { TablePanel } from "@/components/dashboard/TablePanel";
import { mockReports } from "../mockReports";
import { reportsColumns } from "../reportsColumns/reportsColumns";

import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";

export interface ReportsTableProps {
  data?: any[];
}

export default function ReportsTable({ data: customData }: ReportsTableProps = {}) {
  const tableData = customData && customData.length > 0 ? customData : mockReports;

  const customHeader = (
    <PanelHeader
      icon="revenue"
      title="Top Products by Revenue"
      subtitle="Best sellers with growth & margin — prioritize marketing budget here"
    />
  );

  return (
    <TablePanel ariaLabel="Top Products by Revenue" header={customHeader}>
      <DataTable
        columns={reportsColumns}
        data={tableData}
        getRowId={(row: any) => row.destination_id ? `dest-${row.destination_id}` : String(row.id || row.destination || row.destination_name || "row")}
        selectable={true}
      />
    </TablePanel>
  );
}

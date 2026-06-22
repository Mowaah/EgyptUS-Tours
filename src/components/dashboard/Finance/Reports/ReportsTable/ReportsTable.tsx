"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { TablePanel } from "@/components/dashboard/TablePanel";
import { mockReports } from "../mockReports";
import { reportsColumns } from "../reportsColumns/reportsColumns";

import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";

export default function ReportsTable() {
  const [data] = useState(mockReports);

  const customHeader = (
    <PanelHeader
      icon="revenue"
      title="Top Products by Revenue"
      subtitle="Best sellers with margin & growth — prioritize marketing budget here"
    />
  );

  return (
    <TablePanel ariaLabel="Top Products by Revenue" header={customHeader}>
      <DataTable
        columns={reportsColumns}
        data={data}
        getRowId={(row) => row.id}
        selectable={true}
      />
    </TablePanel>
  );
}

"use client";

import { useMemo } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { contactUsColumns } from "./contactUsColumns";
import { mockContactUsData } from "./mockContactUsData";

export default function ContactUsPanel() {
  const filterFields = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        value: "All",
        options: [
          "All",
          "New",
          "Replied",
          "Closed",
        ],
        onChange: () => {},
      },
    ],
    []
  );

  if (mockContactUsData.length === 0) {
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
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={() => {}} onApply={() => {}} />}
    >
      <DataTable
        data={mockContactUsData}
        columns={contactUsColumns}
        getRowId={(row) => row.id}
        selectable
      />
    </TablePanel>
  );
}

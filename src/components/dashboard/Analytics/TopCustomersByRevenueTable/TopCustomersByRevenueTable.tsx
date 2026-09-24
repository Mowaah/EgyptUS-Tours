"use client";

import React from "react";
import { useRouter } from "next/navigation";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import DataTable from "@/components/dashboard/DataTable/DataTable";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import styles from "./TopCustomersByRevenueTable.module.scss";
import { formatCurrencyAmount } from "@/utils/formatMetric";

import { TopCustomer } from "@/services/admin/adminReportsService";

export default function TopCustomersByRevenueTable({ 
  data, 
  actions 
}: { 
  data?: TopCustomer[]; 
  actions?: React.ReactNode; 
}) {
  const router = useRouter();
  const isEmpty = !data || data.length === 0;

  const handleView = (row: TopCustomer) => {
    const customerId = row.customer_id ?? row.id;
    if (customerId) {
      router.push(`/dashboard/customers/${customerId}`);
    }
  };

  const columns = [
    {
      id: "customer",
      header: "Customer",
      render: (row: TopCustomer) => <span className={styles.cellText}>{row.customer_name}</span>,
    },
    {
      id: "email",
      header: "Email",
      render: (row: TopCustomer) => <span className={styles.cellText}>{row.email}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      render: (row: TopCustomer) => (
        <span className={styles.cellText}>
          {formatCurrencyAmount(row.total_revenue)}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      render: (row: TopCustomer) => (
        <ViewButton onClick={() => handleView(row)} />
      ),
    },
  ];

  return (
    <article className={`${parentStyles.chartCard} ${styles.card}`}>
      <PanelHeader
        icon="finance/payment/chart" 
        title="Top Customers by Revenue"
        actions={actions}
      />
      
      {isEmpty ? (
        <DashboardEmptyState
          compact
          className={styles.emptyState}
          title="No customer revenue yet"
        />
      ) : (
        <div className={styles.tableWrapper}>
          <DataTable
            className={styles.compactTable}
            data={data}
            columns={columns}
            getRowId={(row) => row.email}
            defaultPageSize={4}
            pageSizeOptions={[4, 10, 20]}
          />
        </div>
      )}
    </article>
  );
}

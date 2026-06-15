"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { DataTable } from "@/components/dashboard/DataTable";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal, DashboardStatusBanner } from "@/components/shared";
import { mockAuditLogs } from "./auditLogData";
import type { AuditLogEntry } from "./auditLogData";
import styles from "./AuditLog.module.scss";

const actionClass: Record<AuditLogEntry["action"], string> = {
  "Delete Lead": styles.actionDeleteLead,
  Login: styles.actionLogin,
  "Update Status": styles.actionUpdateStatus,
  "Create User": styles.actionCreateUser,
  "Delete Review": styles.actionDeleteReview,
};

const filterOptions = {
  adminUser: ["All", "Mona Saleh", "Mohammad Karim", "Ilham Budi Agung", "John Bushmill", "Linda Blair", "Josh Adam"],
  module: ["All", "Leads & Inquiries", "Finance", "Catalog", "Bookings", "Reviews"],
  dateRange: ["All", "Today", "Yesterday", "Last 7 Days", "Last 30 Days"],
  action: ["All", "Delete Lead", "Login", "Update Status", "Create User", "Delete Review"],
};

export default function AuditLog() {
  const defaultFilters = { adminUser: "All", module: "All", dateRange: "All", action: "All" };
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [saveNoticeMessage, setSaveNoticeMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AuditLogEntry | null>(null);

  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreItem, setRestoreItem] = useState<AuditLogEntry | null>(null);



  const filteredLogs = useMemo(
    () =>
      mockAuditLogs.filter((log) => {
        if (appliedFilters.adminUser !== "All" && log.adminUser !== appliedFilters.adminUser) return false;
        if (appliedFilters.module !== "All" && log.module !== appliedFilters.module) return false;
        if (appliedFilters.action !== "All" && log.action !== appliedFilters.action) return false;
        // Date range filtering is mock-only for simplicity
        return true;
      }),
    [appliedFilters]
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
      ["adminUser", "Admin user", filterOptions.adminUser],
      ["module", "Module", filterOptions.module],
      ["dateRange", "Date range", filterOptions.dateRange],
      ["action", "Action", filterOptions.action],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id],
    options: options as unknown as string[],
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const auditLogColumns: DataTableColumn<AuditLogEntry>[] = [
    {
      id: "id",
      header: "Record ID",
      cellClassName: styles.idCell,
      render: (row) => row.id,
    },
    {
      id: "timestamp",
      header: "Timestamp",
      render: (row) => row.timestamp,
    },
    {
      id: "adminUser",
      header: "Admin User",
      render: (row) => row.adminUser,
    },
    {
      id: "action",
      header: "Action",
      render: (row) => (
        <span className={`${styles.pill} ${actionClass[row.action]}`}>
          <i aria-hidden />
          {row.action}
        </span>
      ),
    },
    {
      id: "module",
      header: "Module",
      render: (row) => row.module,
    },
    {
      id: "beforeValue",
      header: "Before Value",
      render: (row) => row.beforeValue,
    },
    {
      id: "afterValue",
      header: "After Value",
      render: (row) => {
        if (row.afterValue === "Approved") {
          return (
            <span className={`${styles.pill} ${styles.stateActive}`}>
              <Image
                src="/images/dashboard/active.svg"
                alt=""
                width={16}
                height={16}
                className={styles.stateIcon}
                aria-hidden
              />
              Approved
            </span>
          );
        }
        if (row.afterValue === "Inactive") {
          return (
            <span className={`${styles.pill} ${styles.stateInactive}`}>
              <Image
                src="/images/dashboard/inactive.svg"
                alt=""
                width={16}
                height={16}
                className={styles.stateIcon}
                aria-hidden
              />
              Inactive
            </span>
          );
        }
        return row.afterValue;
      },
    },
  ];

  const rowActions = (_row: AuditLogEntry) => [
    {
      label: "Restore Changes",
      iconSrc: "/images/dashboard/restore.svg",
      onClick: (item: AuditLogEntry) => {
        setRestoreItem(item);
        setRestoreModalOpen(true);
      },
    },
    {
      label: "Delete Log",
      variant: "danger" as const,
      iconSrc: "/images/dashboard/delete.svg",
      onClick: (item: AuditLogEntry) => {
        setDeleteItem(item);
        setDeleteModalOpen(true);
      },
    },
  ];

  const confirmDelete = () => {
    setDeleteModalOpen(false);
    if (deleteItem) {
      setSaveNoticeMessage(`The audit log for record ${deleteItem.id} has been deleted successfully.`);
      setShowSaveNotice(true);
      setDeleteItem(null);
    }
  };

  const confirmRestore = () => {
    setRestoreModalOpen(false);
    if (restoreItem) {
      setSaveNoticeMessage(`The changes for record ${restoreItem.id} have been restored successfully.`);
      setShowSaveNotice(true);
      setRestoreItem(null);
    }
  };

  return (
    <div className={styles.page}>
      <TablePanel
        ariaLabel="System audit log table"
        title="Audit Log"
        iconSrc="/images/dashboard/audit.svg"
        className={styles.panel}
        headerActions={
          <>
            <TablePanelHeaderButton iconSrc="/images/dashboard/filter.svg">
              Filters
            </TablePanelHeaderButton>
            <TablePanelHeaderButton iconSrc="/images/dashboard/export.svg">
              Export Data
            </TablePanelHeaderButton>
          </>
        }
        toolbar={
          <div className={styles.toolbarStack}>
            <DashboardStatusBanner
              show={showSaveNotice}
              onClose={() => setShowSaveNotice(false)}
              message={saveNoticeMessage}
            />
            <TablePanelFilterBar
              fields={filterFields}
              onClean={resetFilters}
              onApply={applyFilters}
            />
          </div>
        }
      >
        <DataTable
          data={filteredLogs}
          columns={auditLogColumns}
          getRowId={(row) => row.uid}
          selectable
          rowActions={rowActions}
          defaultPageSize={5}
        />
      </TablePanel>

      <DashboardConfirmationModal
        open={deleteModalOpen}
        variant="delete"
        title="Delete Audit Log"
        message={
          <>
            Are you sure you want to permanently delete this audit log record ({deleteItem?.id})?
            <br />
            This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <DashboardConfirmationModal
        open={restoreModalOpen}
        variant="activate"
        title="Restore Changes"
        message={
          <>
            Are you sure you want to restore the changes for record {restoreItem?.id}?
            <br />
            This will revert it back to its before state.
          </>
        }
        confirmLabel="Restore"
        onClose={() => setRestoreModalOpen(false)}
        onConfirm={confirmRestore}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { DataTable } from "@/components/dashboard/DataTable";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal, DashboardStatusBanner } from "@/components/dashboard/shared";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import useSWR from "swr";
import { fetchAuditLogs, deleteAuditLog, exportAuditLogs } from "@/services/admin/adminAuditLogService";
import styles from "./AuditLog.module.scss";

// Removed actionClass, handled directly in column render

const filterOptions = {
  // Hardcoded for now unless we want to fetch dynamic dropdown options
  module: ["All", "Leads", "Finance", "Catalog", "Bookings", "Reviews", "System Config"],
  dateRange: ["All", "Today", "Yesterday", "Last 7 Days", "Last 30 Days"],
  action: ["All", "Create", "Update", "Delete", "Login", "Logout"],
};

const moduleSlugMap: Record<string, string> = {
  "Leads": "leads_inquiries",
  "Finance": "finance",
  "Catalog": "catalog",
  "Bookings": "bookings",
  "Reviews": "reviews",
  "System Config": "system_config"
};

const actionSlugMap: Record<string, string> = {
  "Create": "create",
  "Update": "update",
  "Delete": "delete",
  "Login": "login",
  "Logout": "logout",
};

const IDENTIFIER_KEYS = ["name", "title", "full_name", "email", "slug", "question", "filename", "label"];

const extractIdentifier = (obj: Record<string, any>): string | null => {
  for (const key of IDENTIFIER_KEYS) {
    if (key in obj && obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      return String(obj[key]);
    }
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k === "id") continue;
    if (typeof v === "string" || typeof v === "number") return String(v);
  }
  return null;
};

const AuditValueRender = ({ value, otherValue, isAfter }: { value: any, otherValue: any, isAfter: boolean }) => {
  if (value === null || value === undefined || value === "") return <span>-</span>;
  if (typeof value !== "object") {
    const strVal = String(value);
    const isLong = strVal.length > 80;
    const displayString = isLong ? strVal.slice(0, 80) + "..." : strVal;
    return (
      <span
        style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        title={isLong ? strVal : undefined}
      >
        {displayString}
      </span>
    );
  }

  let displayKey = "";
  let displayVal: any = "";

  if (otherValue && typeof otherValue === "object") {
    const beforeObj = isAfter ? otherValue : value;
    const afterObj = isAfter ? value : otherValue;
    const changedKeys = Object.keys(afterObj).filter(k =>
      JSON.stringify(beforeObj[k]) !== JSON.stringify(afterObj[k]) &&
      !["last_activity_at", "updated_at", "created_at"].includes(k)
    );
    if (changedKeys.length === 1) {
      displayKey = changedKeys[0];
      displayVal = value[displayKey];
    } else if (changedKeys.length > 1 && changedKeys.includes("status")) {
      displayKey = "status";
      displayVal = value["status"];
    } else if (changedKeys.length > 1 && changedKeys.includes("is_active")) {
      displayKey = "is_active";
      displayVal = value["is_active"];
    } else if (changedKeys.length > 0) {
      displayKey = changedKeys[0];
      displayVal = value[displayKey];
    }
  }

  if (!displayKey) {
    if ("status" in value) {
      displayKey = "status";
      displayVal = value.status;
    } else if ("is_active" in value) {
      displayKey = "is_active";
      displayVal = value.is_active;
    } else if ("rating" in value) {
      displayKey = "rating";
      displayVal = value.rating;
    } else {
      const identifier = extractIdentifier(value);
      const str = JSON.stringify(value);
      if (identifier) {
        return <span title={str} style={{ color: "#64748b", overflowWrap: "anywhere", wordBreak: "break-word" }}>{identifier}</span>;
      }
      return <span title={str} style={{ color: "#64748b", overflowWrap: "anywhere", wordBreak: "break-word" }}>{str.length > 80 ? str.slice(0, 80) + "..." : str}</span>;
    }
  }

  const label = displayKey.charAt(0).toUpperCase() + displayKey.slice(1).replace(/_/g, " ");

  if (displayKey === "status" || displayKey === "is_active" || displayKey === "user_is_active") {
    const statusLower = String(displayVal).toLowerCase();
    const isActive = statusLower === "active" || statusLower === "approved" || statusLower === "true";
    const isInactive = statusLower === "inactive" || statusLower === "blocked" || statusLower === "rejected" || statusLower === "false";

    if (isAfter && isActive) {
      return (
        <span className={`${styles.pill} ${styles.stateActive}`}>
          <Image src="/images/dashboard/active.svg" alt="" width={16} height={16} className={styles.stateIcon} aria-hidden />
          {statusLower === "true" ? "Active" : String(displayVal).charAt(0).toUpperCase() + String(displayVal).slice(1)}
        </span>
      );
    }
    if (isAfter && isInactive) {
      return (
        <span className={`${styles.pill} ${styles.stateInactive}`}>
          <Image src="/images/dashboard/inactive.svg" alt="" width={16} height={16} className={styles.stateIcon} aria-hidden />
          {statusLower === "false" ? "Inactive" : String(displayVal).charAt(0).toUpperCase() + String(displayVal).slice(1)}
        </span>
      );
    }
  }

  let formattedVal = displayVal;
  if (formattedVal !== null && typeof formattedVal === "object") {
    if (Array.isArray(formattedVal)) {
      if (formattedVal.every(item => typeof item !== "object" || item === null)) {
        formattedVal = formattedVal.join(", ");
      } else {
        formattedVal = formattedVal.map((item, index) => {
          if (item && typeof item === "object") {
            return item.name || item.title || item.text || item.label || (item.id ? `#${item.id}` : `Item ${index + 1}`);
          }
          return String(item);
        }).join(" • ");
      }
    } else {
      const name = formattedVal.name || formattedVal.title || formattedVal.text || formattedVal.label;
      if (name) {
        formattedVal = String(name);
      } else {
        formattedVal = Object.entries(formattedVal)
          .filter(([k]) => !["id", "created_at", "updated_at"].includes(k))
          .map(([k, v]) => {
            if (v !== null && typeof v === "object") {
              if (Array.isArray(v)) {
                return `${k}: [${v.map(item => typeof item === "object" ? JSON.stringify(item) : String(item)).join(", ")}]`;
              }
              const inner = Object.entries(v)
                .map(([ik, iv]) => `${ik}: ${typeof iv === "object" && iv !== null ? JSON.stringify(iv) : String(iv)}`)
                .join(", ");
              return `${k}: { ${inner} }`;
            }
            return `${k}: ${String(v)}`;
          })
          .join(", ");
      }
    }
  } else {
    formattedVal = String(formattedVal);
  }

  const isLong = formattedVal.length > 80;
  const displayString = isLong ? formattedVal.slice(0, 80) + "..." : formattedVal;

  return (
    <span
      style={{ color: "#64748b", overflowWrap: "anywhere", wordBreak: "break-word" }}
      title={isLong ? formattedVal : undefined}
    >
      {label}: {displayString}
    </span>
  );
};

interface AuditLogProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function AuditLog({ searchQuery = "", onClearSearch }: AuditLogProps) {
  const defaultFilters = { module: "All", dateRange: "All", action: "All" };
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [saveNoticeMessage, setSaveNoticeMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: pageIndex + 1,
      page_size: pageSize,
    };
    if (appliedFilters.module !== "All") {
      params.module = moduleSlugMap[appliedFilters.module] || appliedFilters.module.toLowerCase();
    }
    if (appliedFilters.action !== "All") {
      params.action = actionSlugMap[appliedFilters.action] || appliedFilters.action.toLowerCase();
    }
    // Date range requires calculating date_from and date_to if we want to support it properly
    if (searchQuery) params.search = searchQuery;
    return params;
  }, [appliedFilters, searchQuery, pageIndex, pageSize]);

  const { data, mutate, isLoading } = useSWR(["/audit-log", queryParams], () => fetchAuditLogs(queryParams));
  const logs = data?.results || [];
  const totalCount = data?.count || 0;



  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPageIndex(0);
    if (onClearSearch) onClearSearch();
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setPageIndex(0);
  };

  const filterFields = (
    [
      ["module", "Module", filterOptions.module],
      ["dateRange", "Date range", filterOptions.dateRange],
      ["action", "Action", filterOptions.action],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof defaultFilters],
    options: options as unknown as string[],
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const auditLogColumns: DataTableColumn<any>[] = [
    {
      id: "id",
      header: "Record ID",
      cellClassName: styles.idCell,
      render: (row) => row.display_id,
    },
    {
      id: "timestamp",
      header: "Timestamp",
      render: (row) => {
        if (!row.created_at) return "-";
        const date = new Date(row.created_at);
        return date.toLocaleString();
      },
    },
    {
      id: "adminUser",
      header: "Admin User",
      render: (row) => row.actor?.full_name || row.actor?.email || "System",
    },
    {
      id: "action",
      header: "Action",
      render: (row) => {
        const actionStr = (row.action_label || row.action || "").toLowerCase();
        let actionStyle = styles.pillDefault;
        if (actionStr.includes("create")) actionStyle = styles.actionCreate;
        else if (actionStr.includes("delete")) actionStyle = styles.actionDelete;
        else if (actionStr.includes("update")) actionStyle = styles.actionUpdate;
        else if (actionStr.includes("login")) actionStyle = styles.actionLogin;
        else if (actionStr.includes("logout")) actionStyle = styles.actionLogout;
        else if (actionStr.includes("export")) actionStyle = styles.actionExport;

        return (
          <span className={`${styles.pill} ${actionStyle}`}>
            <i aria-hidden />
            {row.action_label}
          </span>
        );
      },
    },
    {
      id: "module",
      header: "Module",
      render: (row) => row.module_label,
    },
    {
      id: "before_value",
      header: "Before Value",
      render: (row) => <AuditValueRender value={row.before_value} otherValue={row.after_value} isAfter={false} />,
    },
    {
      id: "after_value",
      header: "After Value",
      render: (row) => <AuditValueRender value={row.after_value} otherValue={row.before_value} isAfter={true} />,
    },
  ];

  const rowActions = () => [
    {
      label: "Delete Log",
      variant: "danger" as const,
      iconSrc: "/images/dashboard/delete.svg",
      onClick: (item: any) => {
        setDeleteItem(item);
        setDeleteModalOpen(true);
      },
    },
  ];

  const confirmDelete = async () => {
    setDeleteModalOpen(false);
    if (deleteItem) {
      try {
        await deleteAuditLog(deleteItem.id);
        setSaveNoticeMessage(`The audit log for record ${deleteItem.display_id} has been deleted successfully.`);
        setShowSaveNotice(true);
        mutate();
      } catch (error) {
        console.error("Failed to delete audit log", error);
      }
      setDeleteItem(null);
    }
  };

  return (
    <div className={styles.page}>
      <TablePanel
        ariaLabel="System audit log table"
        title="Audit Log"
        iconSrc="/images/dashboard/audit.svg"
        className={styles.panel}
        showFilters={true}
        showExport={true}
        onExportClick={async () => {
          try {
            await exportAuditLogs(queryParams);
            setSaveNoticeMessage("Audit logs exported successfully.");
            setShowSaveNotice(true);
          } catch (error) {
            console.error("Failed to export audit logs", error);
          }
        }}
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
          data={logs}
          columns={auditLogColumns}
          getRowId={(row) => String(row.id)}
          rowActions={rowActions}
          serverSidePagination={true}
          totalCount={totalCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          defaultPageSize={10}
          isLoading={isLoading}
          onClearSearch={resetFilters}
          emptyState={
            !searchQuery && appliedFilters.module === "All" && appliedFilters.action === "All" ? (
              <DashboardEmptyState
                title="No Audit Logs Found"
                subtitle="System audit logs will appear here when actions are recorded."
                imageSrc="/images/dashboard/empty.png"
              />
            ) : appliedFilters.module !== "All" || appliedFilters.action !== "All" ? (
              <DashboardFilterEmptyState
                onClearFilters={resetFilters}
                title="No Audit Log Yet"
                subtitle={`No audit logs match the selected ${appliedFilters.module !== "All" ? 'module' : 'action'}.`}
              />
            ) : undefined
          }
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
    </div>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import useSWR from "swr";
import { DataTable } from "@/components/dashboard/DataTable";
import TablePanel from "@/components/dashboard/TablePanel/TablePanel";
import type { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable/types";
import LanguageTabs, { type Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { useVehicleCategories } from "@/hooks/useCatalogVehicles";
import {
  getVehicleRoutes,
  exportVehicleRoutesCsv,
  type VehicleRouteItem,
} from "@/services/admin/adminCatalogVehicleRoutesService";
import styles from "./VehicleRoutesPanel.module.scss";

const LANG_MAP: Record<Language, "en" | "it" | "es"> = {
  English: "en",
  Italian: "it",
  Spanish: "es",
};

interface VehicleRoutesPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onEditRoute: (route: VehicleRouteItem) => void;
  onDeleteRoute: (route: VehicleRouteItem) => void;
  onAddRoute?: () => void;
  refreshTrigger?: number;
}

export default function VehicleRoutesPanel({
  searchQuery = "",
  onClearSearch,
  onEditRoute,
  onDeleteRoute,
  onAddRoute,
  refreshTrigger = 0,
}: VehicleRoutesPanelProps) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isExporting, setIsExporting] = useState(false);

  // Reset to page 1 on search query or language change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, lang]);

  const langCode = LANG_MAP[lang];

  const { data, isLoading } = useSWR(
    ["adminVehicleRoutes", searchQuery, langCode, page, pageSize, refreshTrigger],
    () =>
      getVehicleRoutes({
        search: searchQuery || undefined,
        lang: langCode,
        page,
        page_size: pageSize,
      }),
    { keepPreviousData: true }
  );

  const { categories: rawCategories } = useVehicleCategories();

  const routes: VehicleRouteItem[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    const responseWithData = data as unknown as { data?: { results?: VehicleRouteItem[] } | VehicleRouteItem[] };
    if (Array.isArray(responseWithData?.data)) return responseWithData.data;
    if (Array.isArray(responseWithData?.data?.results)) return responseWithData.data.results;
    return [];
  }, [data]);

  const totalCount = useMemo(() => {
    if (typeof data?.count === "number") return data.count;
    const responseWithData = data as unknown as { data?: { count?: number } };
    if (typeof responseWithData?.data?.count === "number") return responseWithData.data.count;
    return routes.length;
  }, [data, routes.length]);

  const categoryList = useMemo(() => {
    const map = new Map<number, string>();
    if (Array.isArray(rawCategories)) {
      rawCategories.forEach((c: { id?: number | string; name?: string }) => {
        if (c && c.id != null) {
          map.set(Number(c.id), c.name || `Category ${c.id}`);
        }
      });
    }
    routes.forEach((r) => {
      r.prices?.forEach((p) => {
        if (p.category_id != null && !map.has(Number(p.category_id))) {
          map.set(Number(p.category_id), p.category_name || `Category ${p.category_id}`);
        }
      });
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rawCategories, routes]);

  const columns: DataTableColumn<VehicleRouteItem>[] = useMemo(() => {
    const cols: DataTableColumn<VehicleRouteItem>[] = [
      {
        id: "route_code",
        header: "Route ID",
        render: (row) => (
          <span className={styles.routeCode}>{row.route_code || `RT-${row.id}`}</span>
        ),
      },
      {
        id: "from_location",
        header: "From",
        render: (row) => (
          <span className={styles.location}>{row.from_location || "—"}</span>
        ),
      },
      {
        id: "to_location",
        header: "To",
        render: (row) => (
          <span className={styles.location}>{row.to_location || "—"}</span>
        ),
      },
    ];

    categoryList.forEach((cat) => {
      cols.push({
        id: `category_${cat.id}`,
        header: cat.name,
        render: (row) => {
          const item = row.prices?.find((p) => Number(p.category_id) === cat.id);
          if (!item || item.price === null || item.price === undefined || item.price === "") {
            return <span className={styles.emptyPrice}>—</span>;
          }
          const numeric = parseFloat(String(item.price));
          const formatted = isNaN(numeric)
            ? item.price
            : `$${numeric % 1 === 0 ? numeric : numeric.toFixed(2)}`;
          return <span className={styles.price}>{formatted}</span>;
        },
      });
    });

    return cols;
  }, [categoryList]);

  const rowActions = (row: VehicleRouteItem): DataTableRowAction<VehicleRouteItem>[] => [
    {
      label: "Edit",
      iconSrc: "/images/dashboard/edit.svg",
      onClick: () => onEditRoute(row),
    },
    {
      label: "Remove",
      iconSrc: "/images/dashboard/delete.svg",
      variant: "danger",
      onClick: () => onDeleteRoute(row),
    },
  ];

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportVehicleRoutesCsv();
    } catch (error) {
      console.error("Failed to export routes CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <TablePanel
      ariaLabel="Routes and pricing table"
      title="Routes & Pricing"
      iconSrc="/images/dashboard/catalog/routes.svg"
      showExport
      exportLabel={isExporting ? "Exporting..." : "Export Data"}
      onExportClick={handleExport}
    >
      <div className={styles.langWrapper}>
        <LanguageTabs active={lang} onChange={setLang} />
      </div>

      <DataTable
        data={routes}
        columns={columns}
        getRowId={(row) => String(row.id)}
        rowActions={rowActions}
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={12}
        pageSizeOptions={[5, 10, 12, 15, 20]}
        isLoading={isLoading}
        onClearSearch={onClearSearch}
        emptyState={
          !searchQuery ? (
            <DashboardEmptyState
              title="No Routes Found"
              subtitle="Catalog routes and pricing will appear here once they are created."
              actionLabel="Add New Route"
              onAction={onAddRoute}
              imageSrc="/images/dashboard/empty.png"
            />
          ) : (
            <DashboardSearchEmptyState onClearSearch={onClearSearch} />
          )
        }
      />
    </TablePanel>
  );
}

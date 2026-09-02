"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal, DashboardStatusBanner } from "@/components/dashboard/shared";;
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { promotionsColumns, usePromotionRowActions } from "./promotionsColumns";
import { getAdminPromotions, AdminPromotionList, updateAdminPromotion, deleteAdminPromotion } from "@/services/admin/adminMarketingService";
import type { PromotionRow } from "../types";

interface PromotionsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function PromotionsPanel({ searchQuery = "", onClearSearch }: PromotionsPanelProps) {
  const router = useRouter();
  const defaultFilters = {
    appliesTo: "All",
    validFrom: "All",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<PromotionRow | null>(null);
  const [bannerState, setBannerState] = useState<{ message: string; variant: "success" | "warning" } | null>(null);

  const { data: res, isLoading: loading, mutate } = useSWR(
    "adminMarketingPromotions",
    () => getAdminPromotions(),
    { keepPreviousData: true }
  );

  const promotions: PromotionRow[] = useMemo(() => {
    const data = res?.results || (res as any) || [];
    if (!Array.isArray(data)) return [];

    return data.map((p: AdminPromotionList) => {
      let derivedStatus: "Active" | "Inactive" | "Draft" | "Expired" = p.status === "active" ? "Active" : p.status === "draft" ? "Draft" : "Inactive";
      if (derivedStatus !== "Draft" && p.valid_to) {
        const validToDate = new Date(p.valid_to);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (validToDate < today) {
          derivedStatus = "Expired";
        }
      }

      return {
        id: String(p.id),
        offerId: p.offer_number || `PRO-${p.id}`,
        title: p.title || "Untitled",
        value: `${p.discount_value}%`,
        appliesTo: p.applies_to === "trip" ? "Trips" : p.applies_to === "hotel" ? "Hotels" : "Transportation",
        validFrom: p.valid_from ? new Date(p.valid_from).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "-",
        validTo: p.valid_to ? new Date(p.valid_to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "-",
        status: derivedStatus,
        usage: p.usage_count,
      };
    });
  }, [res]);

  const filterOptions = useMemo(() => {
    return {
      appliesTo: ["All", "Trips", "Hotels", "Transportation"],
      validFrom: ["All"],
      status: ["All", "Active", "Inactive", "Draft", "Expired"],
    };
  }, []);

  const handleDeleteRow = (row: PromotionRow) => {
    setPromotionToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (row: PromotionRow) => {
    try {
      const newStatus = row.status === "Active" ? "inactive" : "active";
      await updateAdminPromotion(row.id, { status: newStatus });
      await mutate();
      if (row.status === "Active") {
        setBannerState({
          message: `Promotion ${row.offerId} has been deactivated and is no longer available for use on the platform.`,
          variant: "warning",
        });
      } else {
        setBannerState({
          message: `Promotion ${row.offerId} is now active and available for use across the platform.`,
          variant: "success",
        });
      }
    } catch (error) {
      setBannerState({ message: "Failed to update promotion status.", variant: "warning" });
    }
  };

  const rowActions = usePromotionRowActions(handleDeleteRow, handleToggleStatus);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      if (searchQuery && !(promotion.title || "").toLowerCase().includes(searchQuery.toLowerCase()) && !(promotion.offerId || "").toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (appliedFilters.appliesTo !== "All" && promotion.appliesTo !== appliedFilters.appliesTo) return false;
      if (appliedFilters.status !== "All" && promotion.status !== appliedFilters.status) return false;
      return true;
    });
  }, [appliedFilters, searchQuery, promotions]);

  const handleExport = () => {
    if (!filteredPromotions.length) return;

    const headers = ["Offer ID", "Title", "Value", "Applies To", "Valid From", "Valid To", "Status"];
    const csvRows = [headers.join(",")];

    filteredPromotions.forEach(row => {
      const rowData = [
        `"${row.offerId}"`,
        `"${row.title.replace(/"/g, '""')}"`,
        `"${row.value}"`,
        `"${row.appliesTo}"`,
        `"${row.validFrom}"`,
        `"${row.validTo}"`,
        `"${row.status}"`
      ];
      csvRows.push(rowData.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `promotions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filterFields = (
    [
      ["appliesTo", "Applies To", filterOptions.appliesTo],
      ["validFrom", "Valid From", filterOptions.validFrom],
      ["status", "Status", filterOptions.status],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));



  return (
    <TablePanel
      ariaLabel="Promotions table"
      title="Promotions"
      iconSrc="/images/dashboard/sidebar/promotions.svg"
      showFilters
      showExport
      onExportClick={handleExport}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={filteredPromotions}
        columns={promotionsColumns}
        getRowId={(row) => row.id}
        rowActions={rowActions}
        pageSizeOptions={[5, 10, 15]}
        defaultPageSize={10}
        isLoading={loading}
        onClearSearch={resetFilters}
        emptyState={
          promotions.length === 0 ? (
            <DashboardEmptyState
              title="No Promotions Yet"
              subtitle="There are no Promotions available at the moment."
              actionLabel="Create Your First Promotion"
              imageSrc="/images/dashboard/empty.png"
              onAction={() => router.push("/dashboard/marketing/promotions/create")}
            />
          ) : !searchQuery && (appliedFilters.appliesTo !== "All" || appliedFilters.status !== "All" || appliedFilters.validFrom !== "All") ? (
            <DashboardFilterEmptyState
              onClearFilters={resetFilters}
              title="No Results Found"
              subtitle="No results match the selected filters."
            />
          ) : undefined
        }
      />

      <DashboardConfirmationModal
        open={isDeleteModalOpen}
        variant="delete"
        title="Delete Promotion"
        message={`Are you sure you want to delete ${promotionToDelete?.offerId}? This action cannot be undone.`}
        cancelLabel="Back"
        confirmLabel="Delete Promotion"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (promotionToDelete) {
            try {
              await deleteAdminPromotion(promotionToDelete.id);
              await mutate();
              setBannerState({
                message: `Promotion ${promotionToDelete.offerId} has been successfully deleted.`,
                variant: "success",
              });
            } catch (error) {
              setBannerState({ message: "Failed to delete promotion.", variant: "warning" });
            }
          }
          setIsDeleteModalOpen(false);
        }}
      />

      <DashboardStatusBanner
        show={bannerState !== null}
        message={bannerState?.message || ""}
        variant={bannerState?.variant || "success"}
        onClose={() => setBannerState(null)}
      />
    </TablePanel>
  );
}

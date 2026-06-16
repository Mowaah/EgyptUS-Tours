"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal, DashboardStatusBanner } from "@/components/shared";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { promotionsColumns, usePromotionRowActions } from "./promotionsColumns";
import { mockPromotions } from "./promotionsData";
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
  const [bannerState, setBannerState] = useState<{ message: string; variant: "success" | "warning" } | null>(null);

  const filterOptions = useMemo(() => {
    return {
      appliesTo: ["All", ...Array.from(new Set(mockPromotions.map((p) => p.appliesTo)))],
      validFrom: ["All", ...Array.from(new Set(mockPromotions.map((p) => p.validFrom)))],
      status: ["All", ...Array.from(new Set(mockPromotions.map((p) => p.status)))],
    };
  }, []);

  const handleDeleteRow = (row: PromotionRow) => {
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = (row: PromotionRow) => {
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
  };

  const rowActions = usePromotionRowActions(handleDeleteRow, handleToggleStatus);

  const filteredPromotions = useMemo(() => {
    return mockPromotions.filter((promotion) => {
      if (searchQuery && !promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) && !promotion.offerId.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (appliedFilters.appliesTo !== "All" && promotion.appliesTo !== appliedFilters.appliesTo) return false;
      if (appliedFilters.validFrom !== "All" && promotion.validFrom !== appliedFilters.validFrom) return false;
      if (appliedFilters.status !== "All" && promotion.status !== appliedFilters.status) return false;
      return true;
    });
  }, [appliedFilters, searchQuery]);

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

  if (mockPromotions.length > 0 && filteredPromotions.length === 0) {
    return (
      <DashboardEmptyState
        title="No results found"
        subtitle="We couldn't find anything matching your search. Try using different keywords."
        actionLabel="Search Again"
        imageSrc="/images/dashboard/no-search-found.png"
        actionIconSrc="/images/dashboard/refresh.svg"
        onAction={resetFilters}
      />
    );
  }

  if (mockPromotions.length === 0) {
    return (
      <DashboardEmptyState
        title="No Promotions Yet"
        subtitle="There are no Promotions available at the moment."
        actionLabel="Create Your First Promotion"
        imageSrc="/images/dashboard/empty.png"
        onAction={() => router.push("/dashboard/marketing/promotions/create")}
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Promotions table"
      title="Promotions"
      iconSrc="/images/dashboard/sidebar/promotions.svg"
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
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={filteredPromotions}
        columns={promotionsColumns}
        getRowId={(row) => row.id}
        selectable
        rowActions={rowActions}
        defaultPageSize={17}
      />

      <DashboardConfirmationModal
        open={isDeleteModalOpen}
        variant="delete"
        title="Delete Promotion"
        message="Are you sure you want to delete this promotion? This action cannot be undone and the promotion will be permanently removed from the system."
        cancelLabel="Back"
        confirmLabel="Delete Promotion"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          setBannerState({
            message: "The promotion has been deleted successfully",
            variant: "success",
          });
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

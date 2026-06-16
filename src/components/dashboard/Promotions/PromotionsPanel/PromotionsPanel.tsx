"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal } from "@/components/shared";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { promotionsColumns, usePromotionRowActions } from "./promotionsColumns";
import { mockPromotions } from "./promotionsData";
import styles from "./PromotionsPanel.module.scss";
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

  const filterOptions = useMemo(() => {
    return {
      appliesTo: ["All", ...Array.from(new Set(mockPromotions.map((p) => p.appliesTo)))],
      validFrom: ["All", ...Array.from(new Set(mockPromotions.map((p) => p.validFrom)))],
      status: ["All", ...Array.from(new Set(mockPromotions.map((p) => p.status)))],
    };
  }, []);

  const handleDeleteRow = (row: PromotionRow) => {
    setPromotionToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const rowActions = usePromotionRowActions(handleDeleteRow);

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
        subtitle="There are no promotions available at the moment."
        actionLabel="Create Your First Offer"
        onAction={() => {}}
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
        message="Are you sure you want to delete this promotion? This action cannot be undone."
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          // router.push("/dashboard/marketing/promotions?deleted=true");
        }}
      />
    </TablePanel>
  );
}

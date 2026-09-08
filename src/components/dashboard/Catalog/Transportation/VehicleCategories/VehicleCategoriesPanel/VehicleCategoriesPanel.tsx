"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";
import CategoryCard, { Category } from "@/components/dashboard/Catalog/Categories/CategoryCard/CategoryCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { LoadingSpinner } from "@/components/shared";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import styles from "./VehicleCategoriesPanel.module.scss";
import { getAllVehicleCategories } from "@/services/admin/adminCatalogVehicleCategoriesService";
import { getLangKey, getLocalizedName } from "@/components/dashboard/shared/i18n";

interface VehicleCategoriesPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
  onAddCategory?: () => void;
  refreshTrigger?: number;
}

interface VehicleCategoryApiItem {
  id: string | number;
  name?: string;
  title?: string;
  translations?: {
    en?: { name?: string; title?: string };
    it?: { name?: string; title?: string };
    es?: { name?: string; title?: string };
  };
}

export default function VehicleCategoriesPanel({
  searchQuery = "",
  onClearSearch,
  onEditCategory,
  onDeleteCategory,
  onAddCategory,
  refreshTrigger = 0,
}: VehicleCategoriesPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setPage(1);
  }

  const langCode = getLangKey(lang);

  const { data: rawCategories, isLoading } = useSWR(
    ["adminCatalogAllVehicleCategories", langCode, refreshTrigger],
    () => getAllVehicleCategories({ lang: langCode }),
    { keepPreviousData: true }
  );

  const categories: Category[] = useMemo(() => {
    const results = (Array.isArray(rawCategories) ? rawCategories : []) as unknown as VehicleCategoryApiItem[];
    return results.map((c) => {
      const en = c.translations?.en;
      const it = c.translations?.it;
      const es = c.translations?.es;
      return {
        id: String(c.id),
        name: getLocalizedName(c, lang),
        translations: {
          en: en?.name || en?.title || c.name || "",
          it: it?.name || it?.title || "",
          es: es?.name || es?.title || "",
        },
      };
    });
  }, [rawCategories, lang]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        Boolean(c.translations?.en?.toLowerCase().includes(q)) ||
        Boolean(c.translations?.it?.toLowerCase().includes(q)) ||
        Boolean(c.translations?.es?.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  const totalCount = filteredCategories.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);

  const startIndex = (safePage - 1) * rowsPerPage;
  const visibleCategories = useMemo(() => {
    return filteredCategories.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCategories, startIndex, rowsPerPage]);

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && onEditCategory) onEditCategory(category);
  };

  const handleDelete = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && onDeleteCategory) onDeleteCategory(category);
  };

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.iconWrapper}>
            <Image
              src="/images/dashboard/catalog/categories.svg"
              alt=""
              width={20}
              height={20}
            />
          </div>
          <h2 className={styles.title}>Categories</h2>
        </div>

        <button type="button" className={styles.exportButton}>
          <Image
            src="/images/dashboard/export.svg"
            alt="Export"
            width={20}
            height={20}
          />
          Export Data
        </button>
      </header>

      <LanguageTabs active={lang} onChange={setLang} />

      {isLoading ? (
        <LoadingSpinner label="Loading categories..." />
      ) : visibleCategories.length === 0 ? (
        searchQuery.trim() ? (
          <DashboardSearchEmptyState onClearSearch={onClearSearch} />
        ) : (
          <DashboardEmptyState
            title="No Categories Found"
            subtitle="Vehicle categories will appear here once they are added."
            actionLabel={onAddCategory ? "Add New Category" : undefined}
            onAction={onAddCategory}
            imageSrc="/images/dashboard/empty.png"
          />
        )
      ) : (
        <div className={styles.grid}>
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredCategories.length > 0 && (
        <TablePagination
          className={styles.pagination}
          page={safePage}
          pageCount={pageCount}
          rowsPerPage={rowsPerPage}
          pageSizeOptions={[8, 12, 16, 24]}
          onChangePage={setPage}
          onChangeRowsPerPage={(newRows) => {
            setRowsPerPage(newRows);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

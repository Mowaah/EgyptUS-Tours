"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";
import CategoryCard, { Category } from "@/components/dashboard/Catalog/Categories/CategoryCard/CategoryCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./VehicleCategoriesPanel.module.scss";
import { getVehicleCategories } from "@/services/admin/adminCatalogVehicleCategoriesService";
import { getLangKey, getLocalizedName } from "@/components/dashboard/shared/i18n";

interface VehicleCategoriesPanelProps {
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
  refreshTrigger?: number;
}

export default function VehicleCategoriesPanel({
  onEditCategory,
  onDeleteCategory,
  refreshTrigger = 0,
}: VehicleCategoriesPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const langCode = getLangKey(lang);

  const { data, isLoading } = useSWR(
    ["adminCatalogVehicleCategories", page, rowsPerPage, langCode, refreshTrigger],
    () => getVehicleCategories({ page, limit: rowsPerPage, lang: langCode }),
    { keepPreviousData: true }
  );

  const categories: Category[] = useMemo(() => {
    const results = data?.results || [];
    return results.map((c: any) => {
      const en = c.translations?.en;
      const it = c.translations?.it;
      const es = c.translations?.es;
      return {
        id: c.id,
        name: getLocalizedName(c, lang),
        translations: {
          en: en?.name || en?.title || c.name || "",
          it: it?.name || it?.title || "",
          es: es?.name || es?.title || "",
        }
      };
    });
  }, [data, lang]);

  const totalCount = data?.count || 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);

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

        <button className={styles.exportButton}>
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

      <div className={styles.grid}>
        {isLoading && categories.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <TablePagination
        className={styles.pagination}
        page={safePage}
        pageCount={pageCount}
        rowsPerPage={rowsPerPage}
        onChangePage={setPage}
        onChangeRowsPerPage={(newRows) => {
          setRowsPerPage(newRows);
          setPage(1);
        }}
      />
    </div>
  );
}

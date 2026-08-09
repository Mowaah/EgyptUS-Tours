"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";
import CategoryCard, { Category } from "../CategoryCard/CategoryCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./CategoriesPanel.module.scss";
import { getCategories } from "@/services/admin/adminCatalogCategoriesService";
import { getLangKey, getLocalizedName } from "@/components/dashboard/shared/i18n";

interface CategoriesPanelProps {
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
  refreshTrigger?: number;
}

interface CategoryApiItem {
  id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
  translations?: {
    en?: { name?: string; title?: string; };
    it?: { name?: string; title?: string; };
    es?: { name?: string; title?: string; };
  };
}

interface CategoryApiResponse {
  data?: { results?: CategoryApiItem[] } | CategoryApiItem[];
  results?: CategoryApiItem[];
  count?: number;
}

export default function CategoriesPanel({ onEditCategory, onDeleteCategory, refreshTrigger = 0 }: CategoriesPanelProps) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  
  const langCode = getLangKey(lang);

  const { data, isLoading: loading } = useSWR<CategoryApiResponse>(
    ["adminCatalogCategories", page, rowsPerPage, langCode, refreshTrigger],
    () => getCategories({ page, page_size: rowsPerPage, lang: langCode }),
    { keepPreviousData: true }
  );

  const categories: Category[] = useMemo(() => {
    const rawData: CategoryApiItem[] = Array.isArray(data?.data)
      ? data.data
      : data?.data?.results ?? data?.results ?? [];
    
    return rawData.map((c) => {
      const en = c.translations?.en;
      const it = c.translations?.it;
      const es = c.translations?.es;
      return {
        id: String(c.id || c.slug || ""),
        name: getLocalizedName(c, lang),
        translations: {
          en: en?.name || en?.title || c.name || c.title || "",
          it: it?.name || it?.title || "",
          es: es?.name || es?.title || "",
        },
      };
    });
  }, [data, lang]);

  const totalCount = data?.count || 0;

  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleCategories = categories;

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && onEditCategory) {
      onEditCategory(category);
    }
  };

  const handleDelete = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && onDeleteCategory) {
      onDeleteCategory(category);
    }
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
          <h2 className={styles.title}>Trip Categories</h2>
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

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading categories...</div>
      ) : (
        <div className={styles.grid}>
          {visibleCategories.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", padding: "2rem" }}>
              No categories found.
            </div>
          ) : (
            visibleCategories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      {!loading && categories.length > 0 && (
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

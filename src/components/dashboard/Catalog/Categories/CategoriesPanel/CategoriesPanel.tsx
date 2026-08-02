"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CategoryCard, { Category } from "../CategoryCard/CategoryCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./CategoriesPanel.module.scss";
import { getCategories } from "@/services/admin/adminCatalogCategoriesService";

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
}

interface CategoryApiResponse {
  data?: { results?: CategoryApiItem[] } | CategoryApiItem[];
  results?: CategoryApiItem[];
}

export default function CategoriesPanel({ onEditCategory, onDeleteCategory, refreshTrigger = 0 }: CategoriesPanelProps) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // The public endpoint supports pagination. We fetch all for simplicity for now.
        const res = await getCategories({ limit: 1000 }) as CategoryApiResponse;
        const rawData: CategoryApiItem[] = Array.isArray(res?.data)
          ? res.data
          : res?.data?.results ?? res?.results ?? [];
        
        const mapped = rawData.map((c) => ({
          id: String(c.id || c.slug || ""),
          name: c.name || c.title || "",
        }));
        
        setCategories(mapped);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refreshTrigger]);

  const pageCount = Math.max(1, Math.ceil(categories.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleCategories = categories.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

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

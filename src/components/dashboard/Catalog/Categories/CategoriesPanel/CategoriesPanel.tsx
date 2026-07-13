"use client";

import { useState } from "react";
import Image from "next/image";
import CategoryCard, { Category } from "../CategoryCard/CategoryCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./CategoriesPanel.module.scss";

const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Western Desert" },
  { id: "2", name: "Sinai Desert" },
  { id: "3", name: "Oasis Desert" },
  { id: "4", name: "Safari Trips" },
  { id: "5", name: "Multi Country Tours" },
  { id: "6", name: "Multi Country Tours" },
  { id: "7", name: "Multi Country Tours" },
  { id: "8", name: "Multi Country Tours" },
  { id: "9", name: "Multi Country Tours" },
  { id: "10", name: "Multi Country Tours" },
  { id: "11", name: "Multi Country Tours" },
  { id: "12", name: "Multi Country Tours" },
  { id: "13", name: "Multi Country Tours" },
  { id: "14", name: "Multi Country Tours" },
  { id: "15", name: "Multi Country Tours" },
  { id: "16", name: "Multi Country Tours" },
];

interface CategoriesPanelProps {
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
}

export default function CategoriesPanel({ onEditCategory, onDeleteCategory }: CategoriesPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const pageCount = Math.max(1, Math.ceil(MOCK_CATEGORIES.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleCategories = MOCK_CATEGORIES.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleEdit = (id: string) => {
    const category = MOCK_CATEGORIES.find((c) => c.id === id);
    if (category && onEditCategory) {
      onEditCategory(category);
    }
  };

  const handleDelete = (id: string) => {
    const category = MOCK_CATEGORIES.find((c) => c.id === id);
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

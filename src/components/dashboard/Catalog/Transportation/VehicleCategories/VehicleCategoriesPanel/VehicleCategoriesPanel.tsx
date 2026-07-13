"use client";

import { useState } from "react";
import Image from "next/image";
import CategoryCard, { Category } from "@/components/dashboard/Catalog/Categories/CategoryCard/CategoryCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./VehicleCategoriesPanel.module.scss";

const MOCK_VEHICLE_CATEGORIES: Category[] = [
  { id: "1", name: "Sedan" },
  { id: "2", name: "SUV" },
  { id: "3", name: "Luxury" },
  { id: "4", name: "Van" },
  { id: "5", name: "Sedan" },
  { id: "6", name: "SUV" },
  { id: "7", name: "Luxury" },
  { id: "8", name: "Van" },
  { id: "9", name: "Sedan" },
  { id: "10", name: "SUV" },
  { id: "11", name: "Luxury" },
  { id: "12", name: "Van" },
  { id: "13", name: "Mini Bus" },
  { id: "14", name: "Luxury Sedan" },
  { id: "15", name: "Luxury SUV" },
  { id: "16", name: "Limousine" },
];

interface VehicleCategoriesPanelProps {
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
}

export default function VehicleCategoriesPanel({
  onEditCategory,
  onDeleteCategory,
}: VehicleCategoriesPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const pageCount = Math.max(1, Math.ceil(MOCK_VEHICLE_CATEGORIES.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleCategories = MOCK_VEHICLE_CATEGORIES.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const handleEdit = (id: string) => {
    const category = MOCK_VEHICLE_CATEGORIES.find((c) => c.id === id);
    if (category && onEditCategory) onEditCategory(category);
  };

  const handleDelete = (id: string) => {
    const category = MOCK_VEHICLE_CATEGORIES.find((c) => c.id === id);
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

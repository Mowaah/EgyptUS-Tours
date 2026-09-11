"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import CategoryCard, { Category, SortableCategoryCard } from "@/components/dashboard/Catalog/Categories/CategoryCard/CategoryCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { LoadingSpinner } from "@/components/shared";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import styles from "./VehicleCategoriesPanel.module.scss";
import { getAllVehicleCategories, updateVehicleCategory } from "@/services/admin/adminCatalogVehicleCategoriesService";
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

  const { data: rawCategories, isLoading, mutate } = useSWR(
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

  const [orderedItems, setOrderedItems] = useState<Category[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setOrderedItems(categories);
  }, [categories]);

  const activeCategory = useMemo(
    () => orderedItems.find((item) => item.id === activeId),
    [orderedItems, activeId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return orderedItems;
    const q = searchQuery.toLowerCase().trim();
    return orderedItems.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        Boolean(c.translations?.en?.toLowerCase().includes(q)) ||
        Boolean(c.translations?.it?.toLowerCase().includes(q)) ||
        Boolean(c.translations?.es?.toLowerCase().includes(q))
    );
  }, [orderedItems, searchQuery]);

  const totalCount = filteredCategories.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);

  const startIndex = (safePage - 1) * rowsPerPage;
  const visibleCategories = useMemo(() => {
    return filteredCategories.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCategories, startIndex, rowsPerPage]);

  const handleDragStart = (event: DragStartEvent) => {
    if (searchQuery.trim()) return;
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id || searchQuery.trim()) return;

    const sourceIndex = orderedItems.findIndex((item) => item.id === active.id);
    const targetIndex = orderedItems.findIndex((item) => item.id === over.id);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newItems = arrayMove(orderedItems, sourceIndex, targetIndex);
    setOrderedItems(newItems);

    try {
      const updates = newItems.map((item, idx) =>
        updateVehicleCategory(item.id, { order: idx })
      );
      await Promise.all(updates);
      mutate();
    } catch (err) {
      console.error("Failed to update vehicle category order:", err);
      setOrderedItems(categories);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={visibleCategories.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className={styles.grid}>
              {visibleCategories.map((category) => (
                <SortableCategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  disabled={Boolean(searchQuery.trim())}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay adjustScale={false}>
            {activeCategory ? (
              <CategoryCard category={activeCategory} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
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

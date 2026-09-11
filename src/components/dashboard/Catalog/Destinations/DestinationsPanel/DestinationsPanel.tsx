"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { TablePagination } from "@/components/dashboard/shared";
import DestinationCard, { Destination, SortableDestinationCard } from "../DestinationCard/DestinationCard";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { LoadingSpinner } from "@/components/shared";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import styles from "./DestinationsPanel.module.scss";
import { getAllDestinations, updateDestination } from "@/services/admin/adminCatalogDestinationsService";
import { getLangKey, getLocalizedName } from "@/components/dashboard/shared/i18n";

interface DestinationsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onEditDestination?: (dest: Destination) => void;
  onDeleteDestination?: (dest: Destination) => void;
  onAddDestination?: () => void;
  refreshTrigger?: number;
}

interface DestinationApiItem {
  id: string | number;
  name?: string;
  title?: string;
  translations?: {
    en?: { name?: string; title?: string };
    it?: { name?: string; title?: string };
    es?: { name?: string; title?: string };
  };
  image?: string | null;
  image_url?: string | null;
  photo?: string | null;
}

export default function DestinationsPanel({
  searchQuery = "",
  onClearSearch,
  onEditDestination,
  onDeleteDestination,
  onAddDestination,
  refreshTrigger = 0,
}: DestinationsPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setPage(1);
  }

  const langCode = getLangKey(lang);

  const { data: rawDestinations, isLoading: loading, mutate } = useSWR(
    ["adminCatalogAllDestinations", langCode, refreshTrigger],
    () => getAllDestinations({ lang: langCode }),
    { keepPreviousData: true }
  );

  const destinations: Destination[] = useMemo(() => {
    const results = (Array.isArray(rawDestinations) ? rawDestinations : []) as unknown as DestinationApiItem[];

    return results.map((d) => {
      const en = d.translations?.en;
      const it = d.translations?.it;
      const es = d.translations?.es;
      const rawImg = d.image || d.image_url || d.photo;
      const imageSrc = rawImg
        ? rawImg.startsWith("http")
          ? rawImg
          : `http://127.0.0.1:8000${rawImg.startsWith("/") ? "" : "/"}${rawImg}`
        : "/images/dashboard/catalog/destinations/egypt.jpg";

      return {
        id: String(d.id),
        name: getLocalizedName(d, lang),
        translations: {
          en: en?.name || en?.title || d.name || d.title || "",
          it: it?.name || it?.title || "",
          es: es?.name || es?.title || "",
        },
        imageSrc,
      };
    });
  }, [rawDestinations, lang]);

  const [orderedItems, setOrderedItems] = useState<Destination[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setOrderedItems(destinations);
  }, [destinations]);

  const activeDestination = useMemo(
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

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return orderedItems;
    const q = searchQuery.toLowerCase().trim();
    return orderedItems.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        Boolean(d.translations?.en?.toLowerCase().includes(q)) ||
        Boolean(d.translations?.it?.toLowerCase().includes(q)) ||
        Boolean(d.translations?.es?.toLowerCase().includes(q))
    );
  }, [orderedItems, searchQuery]);

  const totalCount = filteredDestinations.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);

  const startIndex = (safePage - 1) * rowsPerPage;
  const visibleDestinations = useMemo(() => {
    return filteredDestinations.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDestinations, startIndex, rowsPerPage]);

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
        updateDestination(item.id, { order: idx })
      );
      await Promise.all(updates);
      mutate();
    } catch (err) {
      console.error("Failed to update destination order:", err);
      setOrderedItems(destinations);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleEdit = (id: string) => {
    const dest = destinations.find((d) => d.id === id);
    if (dest && onEditDestination) {
      onEditDestination(dest);
    }
  };

  const handleDelete = (id: string) => {
    const dest = destinations.find((d) => d.id === id);
    if (dest && onDeleteDestination) {
      onDeleteDestination(dest);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconContainer}>
            <Image src="/images/dashboard/catalog/destinations.svg" alt="" width={20} height={20} className={styles.mapIcon} />
          </div>
          <h2 className={styles.title}>Destinations</h2>
        </div>
        <button type="button" className={styles.exportButton}>
          <Image src="/images/dashboard/export.svg" alt="" width={20} height={20} className={styles.exportIcon} />
          Export Data
        </button>
      </div>

      <LanguageTabs active={lang} onChange={setLang} />

      {loading ? (
        <LoadingSpinner label="Loading destinations..." />
      ) : visibleDestinations.length === 0 ? (
        searchQuery.trim() ? (
          <DashboardSearchEmptyState onClearSearch={onClearSearch} />
        ) : (
          <DashboardEmptyState
            title="No Destinations Found"
            subtitle="Catalog destinations will appear here once they are added."
            actionLabel={onAddDestination ? "Add New Destination" : undefined}
            onAction={onAddDestination}
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
            items={visibleDestinations.map((d) => d.id)}
            strategy={rectSortingStrategy}
          >
            <div className={styles.grid}>
              {visibleDestinations.map((dest) => (
                <SortableDestinationCard
                  key={dest.id}
                  destination={dest}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  disabled={Boolean(searchQuery.trim())}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay adjustScale={false}>
            {activeDestination ? (
              <DestinationCard destination={activeDestination} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {!loading && filteredDestinations.length > 0 && (
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

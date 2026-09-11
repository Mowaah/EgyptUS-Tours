"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
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
import LocationCard, { Location, SortableLocationCard } from "../LocationCard/LocationCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { LoadingSpinner } from "@/components/shared";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import styles from "./LocationsPanel.module.scss";
import { useCatalogHotelLocations } from "@/hooks/useCatalogHotels";
import { updateCatalogHotelLocation } from "@/services/admin/adminCatalogHotelsService";
import { getLocalizedName } from "@/components/dashboard/shared/i18n";

interface LocationsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onEditLocation?: (location: Location) => void;
  onDeleteLocation?: (location: Location) => void;
  onAddLocation?: () => void;
}

interface LocationApiItem {
  id: string | number;
  name?: string;
  title?: string;
  translations?: {
    en?: { name?: string; title?: string };
    it?: { name?: string; title?: string };
    es?: { name?: string; title?: string };
  };
}

export default function LocationsPanel({
  searchQuery = "",
  onClearSearch,
  onEditLocation,
  onDeleteLocation,
  onAddLocation,
}: LocationsPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setPage(1);
  }

  const { locations, loading, refetch } = useCatalogHotelLocations();

  const localizedLocations: Location[] = useMemo(() => {
    const typed = (locations || []) as unknown as LocationApiItem[];
    return typed.map((loc) => {
      const en = loc.translations?.en;
      const it = loc.translations?.it;
      const es = loc.translations?.es;
      return {
        id: String(loc.id),
        name: getLocalizedName(loc, lang),
        translations: {
          en: en?.name || en?.title || loc.name || "",
          it: it?.name || it?.title || "",
          es: es?.name || es?.title || "",
        },
      };
    });
  }, [locations, lang]);

  const [orderedItems, setOrderedItems] = useState<Location[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setOrderedItems(localizedLocations);
  }, [localizedLocations]);

  const activeLocation = useMemo(
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

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return orderedItems;
    const q = searchQuery.toLowerCase().trim();
    return orderedItems.filter((loc) => {
      const nameMatch = loc.name.toLowerCase().includes(q);
      const enMatch = loc.translations?.en?.toLowerCase().includes(q);
      const itMatch = loc.translations?.it?.toLowerCase().includes(q);
      const esMatch = loc.translations?.es?.toLowerCase().includes(q);
      return Boolean(nameMatch || enMatch || itMatch || esMatch);
    });
  }, [orderedItems, searchQuery]);

  const totalCount = filteredLocations.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);

  const startIndex = (safePage - 1) * rowsPerPage;
  const visibleLocations = useMemo(() => {
    return filteredLocations.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLocations, startIndex, rowsPerPage]);

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
        updateCatalogHotelLocation(item.id, { order: idx })
      );
      await Promise.all(updates);
      refetch();
    } catch (err) {
      console.error("Failed to update location order:", err);
      setOrderedItems(localizedLocations);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleEdit = (id: string) => {
    const location = localizedLocations.find((c) => c.id === id);
    if (location && onEditLocation) {
      onEditLocation(location);
    }
  };

  const handleDelete = (id: string) => {
    const location = localizedLocations.find((c) => c.id === id);
    if (location && onDeleteLocation) {
      onDeleteLocation(location);
    }
  };

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.iconWrapper}>
            <Image 
              src="/images/dashboard/catalog/destinations.svg" 
              alt="" 
              width={20} 
              height={20} 
            />
          </div>
          <h2 className={styles.title}>Locations</h2>
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

      {loading ? (
        <LoadingSpinner label="Loading locations..." />
      ) : visibleLocations.length === 0 ? (
        searchQuery.trim() ? (
          <DashboardSearchEmptyState onClearSearch={onClearSearch} />
        ) : (
          <DashboardEmptyState
            title="No Locations Found"
            subtitle="Hotel locations will appear here once they are added."
            actionLabel={onAddLocation ? "Add New Location" : undefined}
            onAction={onAddLocation}
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
            items={visibleLocations.map((loc) => loc.id)}
            strategy={rectSortingStrategy}
          >
            <div className={styles.grid}>
              {visibleLocations.map((loc) => (
                <SortableLocationCard
                  key={loc.id}
                  Location={loc}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  disabled={Boolean(searchQuery.trim())}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay adjustScale={false}>
            {activeLocation ? (
              <LocationCard Location={activeLocation} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {!loading && filteredLocations.length > 0 && (
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

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import LocationCard, { Location } from "../LocationCard/LocationCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { LoadingSpinner } from "@/components/shared";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import styles from "./LocationsPanel.module.scss";
import { useCatalogHotelLocations } from "@/hooks/useCatalogHotels";
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

  const { locations, loading } = useCatalogHotelLocations();

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

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return localizedLocations;
    const q = searchQuery.toLowerCase().trim();
    return localizedLocations.filter((loc) => {
      const nameMatch = loc.name.toLowerCase().includes(q);
      const enMatch = loc.translations?.en?.toLowerCase().includes(q);
      const itMatch = loc.translations?.it?.toLowerCase().includes(q);
      const esMatch = loc.translations?.es?.toLowerCase().includes(q);
      return Boolean(nameMatch || enMatch || itMatch || esMatch);
    });
  }, [localizedLocations, searchQuery]);

  const totalCount = filteredLocations.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);

  const startIndex = (safePage - 1) * rowsPerPage;
  const visibleLocations = useMemo(() => {
    return filteredLocations.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLocations, startIndex, rowsPerPage]);

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
        <div className={styles.grid}>
          {visibleLocations.map((loc) => (
            <LocationCard
              key={loc.id}
              Location={loc}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
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

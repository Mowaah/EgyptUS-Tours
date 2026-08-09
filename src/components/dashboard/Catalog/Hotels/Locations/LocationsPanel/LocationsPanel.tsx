"use client";

import { useState } from "react";
import Image from "next/image";
import LocationCard, { Location } from "../LocationCard/LocationCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./LocationsPanel.module.scss";
import { useCatalogHotelLocations } from "@/hooks/useCatalogHotels";
import { getLocalizedName } from "@/components/dashboard/shared/i18n";

interface LocationsPanelProps {
  onEditLocation?: (location: Location) => void;
  onDeleteLocation?: (location: Location) => void;
}

export default function LocationsPanel({ onEditLocation, onDeleteLocation }: LocationsPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { locations, loading } = useCatalogHotelLocations();

  const pageCount = Math.max(1, Math.ceil(locations.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleLocations = locations
    .slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage)
    .map((loc: any) => ({
      ...loc,
      name: getLocalizedName(loc, lang),
    }));

  const handleEdit = (id: string) => {
    const location = locations.find((c: any) => String(c.id) === String(id));
    if (location && onEditLocation) {
      onEditLocation(location);
    }
  };

  const handleDelete = (id: string) => {
    const location = locations.find((c: any) => String(c.id) === String(id));
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
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading locations...</div>
      ) : (
        <div className={styles.grid}>
          {visibleLocations.map((loc: any) => (
            <LocationCard
              key={loc.id}
              Location={loc}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

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

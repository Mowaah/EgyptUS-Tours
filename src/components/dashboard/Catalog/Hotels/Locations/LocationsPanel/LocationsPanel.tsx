"use client";

import { useState } from "react";
import Image from "next/image";
import LocationCard, { Location } from "../LocationCard/LocationCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import styles from "./LocationsPanel.module.scss";

const MOCK_LOCATIONS: Location[] = [
  { id: "1", name: "Cairo" },
  { id: "2", name: "Alexandria" },
  { id: "3", name: "Giza" },
  { id: "4", name: "Luxor" },
  { id: "5", name: "Cairo" },
  { id: "6", name: "Alexandria" },
  { id: "7", name: "Giza" },
  { id: "8", name: "Luxor" },
  { id: "9", name: "Cairo" },
  { id: "10", name: "Alexandria" },
  { id: "11", name: "Giza" },
  { id: "12", name: "Luxor" },
  { id: "13", name: "Cairo" },
  { id: "14", name: "Alexandria" },
  { id: "15", name: "Giza" },
  { id: "16", name: "Luxor" },
];

interface LocationsPanelProps {
  onEditLocation?: (location: Location) => void;
  onDeleteLocation?: (location: Location) => void;
}

export default function LocationsPanel({ onEditLocation, onDeleteLocation }: LocationsPanelProps = {}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const pageCount = Math.max(1, Math.ceil(MOCK_LOCATIONS.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleLocations = MOCK_LOCATIONS.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleEdit = (id: string) => {
    const location = MOCK_LOCATIONS.find((c) => c.id === id);
    if (location && onEditLocation) {
      onEditLocation(location);
    }
  };

  const handleDelete = (id: string) => {
    const location = MOCK_LOCATIONS.find((c) => c.id === id);
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

      <div className={styles.grid}>
        {visibleLocations.map((Location) => (
          <LocationCard 
            key={Location.id} 
            Location={Location} 
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

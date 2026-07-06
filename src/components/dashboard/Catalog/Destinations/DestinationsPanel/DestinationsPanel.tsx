"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TablePagination } from "@/components/dashboard/shared";
import DestinationCard, { Destination } from "../DestinationCard/DestinationCard";
import styles from "./DestinationsPanel.module.scss";

const MOCK_DESTINATIONS: Destination[] = [
  { id: "1", name: "Egypt", imageSrc: "/images/dashboard/catalog/destinations/egypt.jpg" },
  { id: "2", name: "Spain", imageSrc: "/images/dashboard/catalog/destinations/spain.jpg" },
  { id: "3", name: "Dubai", imageSrc: "/images/dashboard/catalog/destinations/dubai.jpg" },
  { id: "4", name: "Italy", imageSrc: "/images/dashboard/catalog/destinations/italy.jpg" },
  { id: "5", name: "Dubai", imageSrc: "/images/dashboard/catalog/destinations/dubai.jpg" },
  { id: "6", name: "Italy", imageSrc: "/images/dashboard/catalog/destinations/italy.jpg" },
  { id: "7", name: "Brazil", imageSrc: "/images/dashboard/catalog/destinations/brazil.jpg" },
  { id: "8", name: "Greece", imageSrc: "/images/dashboard/catalog/destinations/greece.jpg" },
  { id: "9", name: "Brazil", imageSrc: "/images/dashboard/catalog/destinations/brazil.jpg" },
  { id: "10", name: "Greece", imageSrc: "/images/dashboard/catalog/destinations/greece.jpg" },
  { id: "11", name: "Dubai", imageSrc: "/images/dashboard/catalog/destinations/dubai.jpg" },
  { id: "12", name: "Italy", imageSrc: "/images/dashboard/catalog/destinations/italy.jpg" },
];

interface DestinationsPanelProps {
  onEditDestination?: (dest: Destination) => void;
  onDeleteDestination?: (dest: Destination) => void;
}

export default function DestinationsPanel({ onEditDestination, onDeleteDestination }: DestinationsPanelProps = {}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const pageCount = Math.max(1, Math.ceil(MOCK_DESTINATIONS.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleDestinations = MOCK_DESTINATIONS.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleEdit = (id: string) => {
    const dest = MOCK_DESTINATIONS.find((d) => d.id === id);
    if (dest && onEditDestination) {
      onEditDestination(dest);
    }
  };

  const handleDelete = (id: string) => {
    const dest = MOCK_DESTINATIONS.find((d) => d.id === id);
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

      <div className={styles.grid}>
        {visibleDestinations.map((dest) => (
          <DestinationCard 
            key={dest.id} 
            destination={dest} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        ))}
      </div>

      <TablePagination
        className={styles.pagination}
        page={page}
        pageCount={pageCount}
        rowsPerPage={rowsPerPage}
        pageSizeOptions={[8, 12, 16, 24]}
        onChangePage={setPage}
        onChangeRowsPerPage={setRowsPerPage}
      />
    </div>
  );
}

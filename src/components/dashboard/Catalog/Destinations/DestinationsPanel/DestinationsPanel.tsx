"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TablePagination } from "@/components/dashboard/shared";
import DestinationCard, { Destination } from "../DestinationCard/DestinationCard";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { LoadingSpinner } from "@/components/shared";
import styles from "./DestinationsPanel.module.scss";
import { getDestinations } from "@/services/admin/adminCatalogDestinationsService";

interface DestinationsPanelProps {
  onEditDestination?: (dest: Destination) => void;
  onDeleteDestination?: (dest: Destination) => void;
  refreshTrigger?: number;
}

export default function DestinationsPanel({ onEditDestination, onDeleteDestination, refreshTrigger = 0 }: DestinationsPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchAllDestinations = async () => {
      let allResults: any[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const res: any = await getDestinations({ page_size: 100, page: currentPage });
          const results: any[] = res?.results ?? res?.data?.results ?? (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
          
          const mapped: Destination[] = results.map((d: any) => ({
            id: String(d.id),
            name: d.name ?? d.title ?? "",
            imageSrc: d.image || d.image_url || d.photo ? (d.image || d.image_url || d.photo).startsWith("http") ? (d.image || d.image_url || d.photo) : `http://127.0.0.1:8000${(d.image || d.image_url || d.photo).startsWith('/') ? '' : '/'}${d.image || d.image_url || d.photo}` : "/images/dashboard/catalog/destinations/egypt.jpg",
          }));
          
          allResults = [...allResults, ...mapped];

          if (!res?.next || results.length < 10) {
            hasMore = false;
          } else {
            currentPage++;
          }
        } catch (err) {
          console.error("Failed to fetch destinations:", err);
          hasMore = false;
        }
      }
      
      setDestinations(allResults);
      setPage(1);
      setLoading(false);
    };

    fetchAllDestinations();
  }, [refreshTrigger]);

  const pageCount = Math.max(1, Math.ceil(destinations.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleDestinations = destinations.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

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
      ) : (
        <div className={styles.grid}>
          {visibleDestinations.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", padding: "2rem" }}>
              No destinations found.
            </div>
          ) : (
            visibleDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      {!loading && destinations.length > 0 && (
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

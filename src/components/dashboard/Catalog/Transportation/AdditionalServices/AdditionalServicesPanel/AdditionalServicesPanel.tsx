"use client";

import { useState } from "react";
import Image from "next/image";
import AdditionalServiceCard, { AdditionalService } from "../AdditionalServiceCard/AdditionalServiceCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./AdditionalServicesPanel.module.scss";

const MOCK_SERVICES: AdditionalService[] = [
  { id: "1", name: "Child Seat", price: "10$" },
  { id: "2", name: "Baby Seat", price: "10$" },
  { id: "3", name: "Meet & Greet", price: "10$" },
  { id: "4", name: "Extra Luggage", price: "10$" },
  { id: "5", name: "Child Seat", price: "10$" },
  { id: "6", name: "Baby Seat", price: "10$" },
  { id: "7", name: "Meet & Greet", price: "10$" },
  { id: "8", name: "Extra Luggage", price: "10$" },
  { id: "9", name: "Child Seat", price: "10$" },
  { id: "10", name: "Baby Seat", price: "10$" },
  { id: "11", name: "Meet & Greet", price: "10$" },
  { id: "12", name: "Extra Luggage", price: "10$" },
  { id: "13", name: "Child Seat", price: "10$" },
  { id: "14", name: "Baby Seat", price: "10$" },
  { id: "15", name: "Meet & Greet", price: "10$" },
  { id: "16", name: "Extra Luggage", price: "10$" },
];

interface AdditionalServicesPanelProps {
  onEditService?: (service: AdditionalService) => void;
  onDeleteService?: (service: AdditionalService) => void;
}

export default function AdditionalServicesPanel({
  onEditService,
  onDeleteService,
}: AdditionalServicesPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const pageCount = Math.max(1, Math.ceil(MOCK_SERVICES.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const visibleServices = MOCK_SERVICES.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const handleEdit = (id: string) => {
    const service = MOCK_SERVICES.find((s) => s.id === id);
    if (service && onEditService) onEditService(service);
  };

  const handleDelete = (id: string) => {
    const service = MOCK_SERVICES.find((s) => s.id === id);
    if (service && onDeleteService) onDeleteService(service);
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
          <h2 className={styles.title}>Additional Services</h2>
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
        {visibleServices.map((service) => (
          <AdditionalServiceCard
            key={service.id}
            service={service}
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

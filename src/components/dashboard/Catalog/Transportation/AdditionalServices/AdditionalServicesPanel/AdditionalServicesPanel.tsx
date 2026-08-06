"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";
import AdditionalServiceCard, { AdditionalService } from "../AdditionalServiceCard/AdditionalServiceCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./AdditionalServicesPanel.module.scss";
import { getVehicleAdditionalServices } from "@/services/admin/adminCatalogVehicleAdditionalServicesService";

interface AdditionalServicesPanelProps {
  onEditService?: (service: AdditionalService) => void;
  onDeleteService?: (service: AdditionalService) => void;
  refreshTrigger?: number;
}

export default function AdditionalServicesPanel({
  onEditService,
  onDeleteService,
  refreshTrigger = 0,
}: AdditionalServicesPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const langCode = lang === "English" ? "en" : "ar";

  const { data, isLoading } = useSWR(
    ["adminCatalogVehicleAdditionalServices", page, rowsPerPage, langCode, refreshTrigger],
    () => getVehicleAdditionalServices({ page, limit: rowsPerPage, lang: langCode }),
    { keepPreviousData: true }
  );

  const services: AdditionalService[] = useMemo(() => {
    const results = data?.results || [];
    return results.map((r: any) => ({
      id: r.id,
      name: r.name,
      price: typeof r.price === 'number' ? `$${r.price}` : String(r.price_amount || r.price || "0$"),
    }));
  }, [data]);

  const totalCount = data?.count || 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);

  const handleEdit = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (service && onEditService) onEditService(service);
  };

  const handleDelete = (id: string) => {
    const service = services.find((s) => s.id === id);
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
        {isLoading && services.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            Loading additional services...
          </div>
        ) : services.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            No additional services found.
          </div>
        ) : (
          services.map((service) => (
            <AdditionalServiceCard
              key={service.id}
              service={service}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
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

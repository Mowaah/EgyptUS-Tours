"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";
import AdditionalServiceCard, { AdditionalService } from "../AdditionalServiceCard/AdditionalServiceCard";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { LoadingSpinner } from "@/components/shared";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import styles from "./AdditionalServicesPanel.module.scss";
import { DASHBOARD_CURRENCY } from "@/constants/currency";
import { getAllVehicleAdditionalServices } from "@/services/admin/adminCatalogVehicleAdditionalServicesService";
import { getLangKey, getLocalizedName } from "@/components/dashboard/shared/i18n";

interface AdditionalServicesPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onEditService?: (service: AdditionalService) => void;
  onDeleteService?: (service: AdditionalService) => void;
  onAddService?: () => void;
  refreshTrigger?: number;
}

interface AdditionalServiceApiItem {
  id: string | number;
  name?: string;
  title?: string;
  translations?: {
    en?: { name?: string; title?: string };
    it?: { name?: string; title?: string };
    es?: { name?: string; title?: string };
  };
  price_amount?: string | number;
  price?: string | number;
}

export default function AdditionalServicesPanel({
  searchQuery = "",
  onClearSearch,
  onEditService,
  onDeleteService,
  onAddService,
  refreshTrigger = 0,
}: AdditionalServicesPanelProps = {}) {
  const [lang, setLang] = useState<Language>("English");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setPage(1);
  }

  const langCode = getLangKey(lang);

  const { data: rawServices, isLoading } = useSWR(
    ["adminCatalogAllVehicleAdditionalServices", langCode, refreshTrigger],
    () => getAllVehicleAdditionalServices({ lang: langCode }),
    { keepPreviousData: true }
  );

  const services: AdditionalService[] = useMemo(() => {
    const results = (Array.isArray(rawServices) ? rawServices : []) as unknown as AdditionalServiceApiItem[];
    return results.map((r) => {
      const en = r.translations?.en;
      const it = r.translations?.it;
      const es = r.translations?.es;
      return {
        id: String(r.id),
        name: getLocalizedName(r, lang),
        translations: {
          en: en?.name || en?.title || r.name || "",
          it: it?.name || it?.title || "",
          es: es?.name || es?.title || "",
        },
        price: `${DASHBOARD_CURRENCY.symbol}${r.price_amount || r.price || "0"}`,
      };
    });
  }, [rawServices, lang]);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        Boolean(s.translations?.en?.toLowerCase().includes(q)) ||
        Boolean(s.translations?.it?.toLowerCase().includes(q)) ||
        Boolean(s.translations?.es?.toLowerCase().includes(q))
    );
  }, [services, searchQuery]);

  const totalCount = filteredServices.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const safePage = Math.min(page, pageCount);

  const startIndex = (safePage - 1) * rowsPerPage;
  const visibleServices = useMemo(() => {
    return filteredServices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredServices, startIndex, rowsPerPage]);

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
        <LoadingSpinner label="Loading additional services..." />
      ) : visibleServices.length === 0 ? (
        searchQuery.trim() ? (
          <DashboardSearchEmptyState onClearSearch={onClearSearch} />
        ) : (
          <DashboardEmptyState
            title="No Additional Services Found"
            subtitle="Additional services will appear here once they are added."
            actionLabel={onAddService ? "Add New Service" : undefined}
            onAction={onAddService}
            imageSrc="/images/dashboard/empty.png"
          />
        )
      ) : (
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
      )}

      {!isLoading && filteredServices.length > 0 && (
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

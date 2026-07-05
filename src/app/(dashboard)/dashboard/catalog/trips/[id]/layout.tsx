"use client";

import { use, useState } from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { DashboardFooter } from "@/components/dashboard/shared";
import styles from "./layout.module.scss";

// TODO: replace with real API call
const MOCK_TRIP = {
  id: "BK-TR01",
  name: "Santorini Island Explorer",
};

function buildTabs(id: string) {
  const base = `/dashboard/catalog/trips/${id}`;
  return [
    { id: "overview",   label: "Overview",           href: `${base}/overview`,   iconSrc: "/images/dashboard/catalog/trips/overview.svg" },
    { id: "inclusions", label: "Inclusions",          href: `${base}/inclusions`, iconSrc: "/images/dashboard/catalog/trips/inclusions.svg" },
    { id: "pricing",    label: "Pricing",             href: `${base}/pricing`,    iconSrc: "/images/dashboard/catalog/trips/pricing.svg" },
    { id: "itinerary",  label: "Itinerary",           href: `${base}/itinerary`,  iconSrc: "/images/dashboard/catalog/trips/itinerary.svg" },
    { id: "dates",      label: "Dates Availability",  href: `${base}/dates`,      iconSrc: "/images/dashboard/catalog/trips/dates.svg" },
    { id: "hotels",     label: "Hotels",              href: `${base}/hotels`,     iconSrc: "/images/dashboard/catalog/trips/hotels.svg" },
    { id: "media",      label: "Media",               href: `${base}/media`,      iconSrc: "/images/dashboard/catalog/trips/media.svg" },
    { id: "seo",        label: "SEO",                 href: `${base}/seo`,        iconSrc: "/images/dashboard/catalog/trips/seo.svg" },
  ];
}

export default function TripLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = use(params);
  const [activeLang, setActiveLang] = useState<Language>("English");
  const tabs = buildTabs(id);

  return (
    <div className={styles.page}>
      <DashboardNavbar
        breadcrumbTrail={[
          { label: "Home", href: "/dashboard" },
          { label: "Catalog", href: "/dashboard/catalog/trips" },
          { label: "Trips" },
        ]}
        hideSearch={true}
        hideFilterButton={true}
      >
        <ProfileHeader
          title={`${MOCK_TRIP.id} - ${MOCK_TRIP.name}`}
          subtitleElements={["Experience the thrill of dune bashing and traditional Bedouin camp."]}
          pillLabel="Published"
          pillVariant="green"
          customPills={
            <span className={styles.badgeFeatured}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.39 5.21L16.7999 8.02999C16.9899 8.41999 17.4999 8.78999 17.9299 8.86999L20.48 9.28999C22.11 9.55999 22.49 10.74 21.32 11.92L19.3299 13.91C18.9999 14.24 18.81 14.89 18.92 15.36L19.4899 17.82C19.9399 19.76 18.9 20.52 17.19 19.5L14.7999 18.08C14.3699 17.82 13.65 17.82 13.22 18.08L10.8299 19.5C9.11994 20.51 8.07995 19.76 8.52995 17.82L9.09996 15.36C9.20996 14.9 9.01995 14.25 8.68995 13.91L6.69996 11.92C5.52996 10.75 5.90996 9.56999 7.53996 9.28999L10.0899 8.86999C10.5199 8.79999 11.03 8.41999 11.22 8.02999L12.63 5.21C13.38 3.68 14.62 3.68 15.39 5.21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path opacity="0.4" d="M8 5H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path opacity="0.4" d="M5 19H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path opacity="0.4" d="M3 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg> Featured
            </span>
          }
          actionButtons={
            <div className={styles.actionButtons}>
              <button className={styles.btnEdit} type="button">
                <Image src="/images/dashboard/edit.svg" alt="" width={20} height={20} /> Edit
              </button>
              <button className={styles.btnArchive} type="button">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6.8125V12.6658C13 13.9992 12.6667 14.6658 11 14.6658H5C3.33333 14.6658 3 13.9992 3 12.6658V6.8125" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.33331 1.33203H12.6666C14 1.33203 14.6666 1.9987 14.6666 3.33203V4.66536C14.6666 5.9987 14 6.66536 12.6666 6.66536H3.33331C1.99998 6.66536 1.33331 5.9987 1.33331 4.66536V3.33203C1.33331 1.9987 1.99998 1.33203 3.33331 1.33203Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path opacity="0.34" d="M6.78668 9.33203H9.21335" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg> Archive
              </button>
              <button className={styles.btnDelete} type="button">
                <Image src="/images/dashboard/delete.svg" alt="" width={24} height={24} /> Delete
              </button>
            </div>
          }
        />
      </DashboardNavbar>

      <div className={styles.content}>
        <DashboardTabs tabs={tabs} ariaLabel="Trip Tabs" />
        <LanguageTabs active={activeLang} onChange={setActiveLang} variant="white" />
        {children}
      </div>

      <DashboardFooter lastUpdateDate="6/6/2026" hideActions />
    </div>
  );
}

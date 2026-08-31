"use client";

import { useState, createContext, useContext } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { DashboardFooter, DashboardConfirmationModal, DashboardStatusBanner } from "@/components/dashboard/shared";
import dashboardStyles from "../../../page.module.scss";
import styles from "./layout.module.scss";
import { useCatalogVehicleDetail } from "@/hooks/useCatalogVehicles";
import {
  archiveCatalogVehicle,
  deleteCatalogVehicle,
  publishCatalogVehicle,
  unpublishCatalogVehicle,
} from "@/services/admin/adminCatalogVehiclesService";

export const VehicleDetailContext = createContext<{ vehicle: any; refetch: () => void; loading: boolean; activeLang: Language }>({
  vehicle: null,
  refetch: () => {},
  loading: true,
  activeLang: "English",
});

export function useVehicleDetailContext() {
  return useContext(VehicleDetailContext);
}

function buildTabs(id: string) {
  const base = `/dashboard/catalog/transportation/${id}`;
  return [
    { id: "overview", label: "Overview", href: `${base}/overview`, iconSrc: "/images/dashboard/catalog/trips/overview.svg" },
    { id: "pricing",  label: "Pricing",  href: `${base}/pricing`,  iconSrc: "/images/dashboard/catalog/trips/pricing.svg" },
    { id: "media",    label: "Media",    href: `${base}/media`,    iconSrc: "/images/dashboard/catalog/trips/media.svg" },
    { id: "seo",      label: "SEO",      href: `${base}/seo`,      iconSrc: "/images/dashboard/catalog/trips/seo.svg" },
  ];
}

export default function TransportationLayout({
  children,
}: {
  params?: any;
  children: React.ReactNode;
}) {
  const paramsObj = useParams();
  const id = (paramsObj?.id as string) || "";
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: vehicle, loading, refetch } = useCatalogVehicleDetail(id);
  const [activeLang, setActiveLang] = useState<Language>("English");
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [bannerVariant, setBannerVariant] = useState<"success" | "warning">("success");
  const [isActionPending, setIsActionPending] = useState(false);
  const tabs = buildTabs(id);

  if (pathname?.endsWith("/edit")) {
    return <>{children}</>;
  }
  
  const isArchived = vehicle?.status === "archived";
  const isDraft = vehicle?.status === "draft";

  const showBanner = (message: string, variant: "success" | "warning" = "success") => {
    setBannerVariant(variant);
    setBannerMessage(message);
  };

  const getErrorMessage = (err: unknown, fallback: string) => {
    const data = (err as { response?: { data?: { message?: string; detail?: string; code?: string } } })?.response?.data;
    return data?.message || data?.detail || data?.code || fallback;
  };

  return (
    <VehicleDetailContext.Provider value={{ vehicle, refetch, loading, activeLang }}>
      <div className={styles.page}>
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Catalog", href: "/dashboard/catalog/transportation" },
            { label: "Transportation" },
          ]}
          hideSearch={true}
          hideFilterButton={true}
        >
          <ProfileHeader
            title={vehicle ? `${vehicle.vehicle_code || vehicle.id} - ${vehicle.name}` : "Loading..."}
            subtitleElements={vehicle?.description ? [vehicle.description] : []}
            pillLabel={isArchived ? "Archived" : (vehicle?.status ? vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1) : "")}
            pillVariant={isArchived ? "orange" : isDraft ? "gray" : "green"}
            customPills={
              vehicle?.is_featured ? (
                <span className={styles.badgeFeatured}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.39 5.21L16.7999 8.02999C16.9899 8.41999 17.4999 8.78999 17.9299 8.86999L20.48 9.28999C22.11 9.55999 22.49 10.74 21.32 11.92L19.3299 13.91C18.9999 14.24 18.81 14.89 18.92 15.36L19.4899 17.82C19.9399 19.76 18.9 20.52 17.19 19.5L14.7999 18.08C14.3699 17.82 13.65 17.82 13.22 18.08L10.8299 19.5C9.11994 20.51 8.07995 19.76 8.52995 17.82L9.09996 15.36C9.20996 14.9 9.01995 14.25 8.68995 13.91L6.69996 11.92C5.52996 10.75 5.90996 9.56999 7.53996 9.28999L10.0899 8.86999C10.5199 8.79999 11.03 8.41999 11.22 8.02999L12.63 5.21C13.38 3.68 14.62 3.68 15.39 5.21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> Featured
                </span>
              ) : undefined
            }
            secondaryAction={{
              label: "Edit",
              icon: "/images/dashboard/edit.svg",
              onClick: () => router.push(`/dashboard/catalog/transportation/${id}/edit`),
            }}
            primaryAction={
              isDraft
                ? {
                    label: isActionPending ? "Publishing..." : "Publish",
                    icon: "/images/send.svg",
                    onClick: async () => {
                      if (!vehicle || isActionPending) return;
                      setIsActionPending(true);
                      try {
                        await publishCatalogVehicle(id);
                        await refetch();
                        showBanner("Vehicle published successfully.");
                      } catch (err: any) {
                        showBanner(getErrorMessage(err, "Failed to publish vehicle"), "warning");
                      } finally {
                        setIsActionPending(false);
                      }
                    },
                  }
                : isArchived
                ? {
                    label: isActionPending ? "Publishing..." : "Publish",
                    icon: "/images/send.svg",
                    onClick: async () => {
                      if (!vehicle || isActionPending) return;
                      setIsActionPending(true);
                      try {
                        await unpublishCatalogVehicle(id);
                        await publishCatalogVehicle(id);
                        await refetch();
                        showBanner("Vehicle published successfully.");
                      } catch (err: any) {
                        showBanner(getErrorMessage(err, "Failed to publish vehicle"), "warning");
                      } finally {
                        setIsActionPending(false);
                      }
                    },
                  }
                : undefined
            }
            archiveAction={
              !isArchived && !isDraft
                ? {
                    label: "Archive",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 6.8125V12.6658C13 13.9992 12.6667 14.6658 11 14.6658H5C3.33333 14.6658 3 13.9992 3 12.6658V6.8125" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.33331 1.33203H12.6666C14 1.33203 14.6666 1.9987 14.6666 3.33203V4.66536C14.6666 5.9987 14 6.66536 12.6666 6.66536H3.33331C1.99998 6.66536 1.33331 5.9987 1.33331 4.66536V3.33203C1.33331 1.9987 1.99998 1.33203 3.33331 1.33203Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path opacity="0.34" d="M6.78668 9.33203H9.21335" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    onClick: () => setIsArchiveModalOpen(true),
                  }
                : undefined
            }
            dangerAction={
              !isArchived && !isDraft
                ? {
                    label: "Delete",
                    icon: <Image src="/images/dashboard/delete.svg" alt="" width={16} height={16} style={{ filter: 'brightness(0) saturate(100%) invert(29%) sepia(93%) saturate(3507%) hue-rotate(345deg) brightness(98%) contrast(98%)' }} />,
                    onClick: () => setIsDeleteModalOpen(true),
                  }
                : undefined
            }
          />
        </DashboardNavbar>
        
        <div className={styles.content}>
          {bannerMessage && (
            <DashboardStatusBanner
              show={true}
              message={bannerMessage}
              variant={bannerVariant}
              onClose={() => setBannerMessage(null)}
              className={dashboardStyles.draftBanner}
            />
          )}
          <DashboardTabs tabs={tabs} ariaLabel="Transportation Tabs" />
          <LanguageTabs active={activeLang} onChange={setActiveLang} variant="white" />
          {children}
        </div>
        <DashboardFooter lastUpdateDate={vehicle?.updated_at ? new Date(vehicle.updated_at).toLocaleDateString() : "N/A"} hideActions className={styles.customFooter} />

        <DashboardConfirmationModal
          open={isArchiveModalOpen}
          variant="activate"
          title="Archive Vehicle"
          message="Are you sure you want to archive this vehicle? It will no longer be visible on the public site."
          confirmLabel={isActionPending ? "Archiving..." : "Archive Vehicle"}
          cancelLabel="Cancel"
          onClose={() => setIsArchiveModalOpen(false)}
          onConfirm={async () => {
            if (isActionPending) return;
            setIsActionPending(true);
            try {
              await archiveCatalogVehicle(id);
              await refetch();
              setIsArchiveModalOpen(false);
              showBanner("Vehicle archived successfully.");
            } catch (err: any) {
              showBanner(getErrorMessage(err, "Failed to archive vehicle"), "warning");
            } finally {
              setIsActionPending(false);
            }
          }}
        />

        <DashboardConfirmationModal
          open={isDeleteModalOpen}
          variant="delete"
          title="Delete Vehicle"
          message="Are you sure you want to delete this vehicle? This action cannot be undone."
          confirmLabel={isActionPending ? "Deleting..." : "Delete Vehicle"}
          cancelLabel="Cancel"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
            if (isActionPending) return;
            setIsActionPending(true);
            try {
              await deleteCatalogVehicle(id);
              router.push("/dashboard/catalog/transportation");
            } catch (err: any) {
              showBanner(getErrorMessage(err, "Failed to delete vehicle"), "warning");
              setIsActionPending(false);
            }
          }}
        />
      </div>
    </VehicleDetailContext.Provider>
  );
}

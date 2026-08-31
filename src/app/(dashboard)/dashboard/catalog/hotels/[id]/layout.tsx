"use client";

import { useState, createContext, useContext } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { DashboardFooter, DashboardConfirmationModal, DashboardStatusBanner } from "@/components/dashboard/shared";
import dashboardStyles from "../../../page.module.scss";
import styles from "./layout.module.scss";
import { useCatalogHotelDetail } from "@/hooks/useCatalogHotels";
import {
  archiveCatalogHotel,
  deleteCatalogHotel,
  publishCatalogHotel,
  unpublishCatalogHotel,
} from "@/services/admin/adminCatalogHotelsService";

const BLOCKER_MESSAGES: Record<string, string> = {
  "catalog.hotel.missing_name": "A hotel name is required",
  "catalog.hotel.missing_slug": "A URL slug (SEO) is required",
  "catalog.hotel.missing_location": "A location is required",
  "catalog.hotel.missing_hero_image": "A hero/thumbnail image is required",
  "catalog.hotel.insufficient_gallery_images": "At least 5 gallery images are required",
  "catalog.hotel.missing_rooms": "At least one room is required",
  "catalog.hotel.archived": "Archived hotels cannot be published directly — restore to draft first",
};

function formatBlockers(err: unknown): string {
  const data = (err as { response?: { data?: { message?: string; detail?: string } } })?.response?.data;
  const message = data?.message || data?.detail || "";
  
  const foundBlockers = Object.keys(BLOCKER_MESSAGES).filter((code) => message.includes(code));
  if (foundBlockers.length > 0) {
    return foundBlockers.map(code => BLOCKER_MESSAGES[code]).join(" | ");
  }
  
  return message || "Failed to publish the hotel. Please try again.";
}

export const HotelDetailContext = createContext<{ hotel: any; refetch: () => void; loading: boolean; activeLang: Language }>({
  hotel: null,
  refetch: () => {},
  loading: true,
  activeLang: "English",
});

export function useHotelDetailContext() {
  return useContext(HotelDetailContext);
}

function buildTabs(id: string) {
  const base = `/dashboard/catalog/hotels/${id}`;
  return [
    { id: "overview", label: "Overview", href: `${base}/overview`, iconSrc: "/images/dashboard/catalog/trips/overview.svg" },
    { id: "rooms",    label: "Rooms",    href: `${base}/rooms`,    iconSrc: "/images/dashboard/catalog/hotels/basic.svg" },
    { id: "media",    label: "Media",    href: `${base}/media`,    iconSrc: "/images/dashboard/catalog/trips/media.svg" },
    { id: "seo",      label: "SEO",      href: `${base}/seo`,      iconSrc: "/images/dashboard/catalog/trips/seo.svg" },
  ];
}

export default function HotelLayout({
  children,
}: {
  params?: any;
  children: React.ReactNode;
}) {
  const paramsObj = useParams();
  const id = (paramsObj?.id as string) || "";
  const router = useRouter();
  const pathname = usePathname();

  const { hotel, loading, refetch } = useCatalogHotelDetail(id);

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

  const isArchived = hotel?.status === "ARCHIVED" || hotel?.status === "archived";
  const isDraft = hotel?.status === "DRAFT" || hotel?.status === "draft";
  const isPublished = hotel?.status === "PUBLISHED" || hotel?.status === "published";

  const showBanner = (message: string, variant: "success" | "warning" = "success") => {
    setBannerMessage(message);
    setBannerVariant(variant);
  };

  const handlePublishToggle = async () => {
    setIsActionPending(true);
    try {
      if (isPublished) {
        await unpublishCatalogHotel(id);
        showBanner("The hotel has been unpublished and set to draft.");
      } else {
        await publishCatalogHotel(id);
        showBanner("The hotel has been published successfully.");
      }
      refetch();
    } catch (err: unknown) {
      console.error("Publish toggle failed:", err);
      showBanner(formatBlockers(err), "warning");
    } finally {
      setIsActionPending(false);
    }
  };

  const handleArchiveConfirm = async () => {
    setIsActionPending(true);
    try {
      await archiveCatalogHotel(id);
      showBanner("The hotel has been archived successfully and is no longer visible in the active list.");
      refetch();
    } catch (err) {
      console.error("Archive hotel failed:", err);
      showBanner("Failed to archive hotel.", "warning");
    } finally {
      setIsActionPending(false);
      setIsArchiveModalOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsActionPending(true);
    try {
      await deleteCatalogHotel(id);
      router.push("/dashboard/catalog/hotels?deleted=true");
    } catch (err) {
      console.error("Delete hotel failed:", err);
      showBanner("Failed to delete hotel.", "warning");
      setIsActionPending(false);
      setIsDeleteModalOpen(false);
    }
  };

  const translations = hotel?.translations?.en || {};
  const hotelName = translations.name || hotel?.name || "Hotel Detail";
  const hotelCode = hotel?.hotel_code || hotel?.id || id;
  const subtitle = translations.subtitle || hotel?.subtitle || "";

  return (
    <HotelDetailContext.Provider value={{ hotel, refetch, loading, activeLang }}>
      <div className={styles.page}>
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Catalog", href: "/dashboard/catalog/hotels" },
            { label: "Hotels", href: "/dashboard/catalog/hotels" },
            { label: hotelName, href: `/dashboard/catalog/hotels/${id}` }
          ]}
          hideSearch={true}
          hideFilterButton={true}
        >
          <ProfileHeader
            title={`${hotelCode} - ${hotelName}`}
            subtitleElements={subtitle ? [subtitle] : []}
            pillLabel={isArchived ? "Archived" : isDraft ? "Draft" : "Published"}
            pillVariant={isArchived ? "orange" : isDraft ? "gray" : "green"}
            customPills={
              hotel?.is_featured ? (
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
              onClick: () => router.push(`/dashboard/catalog/hotels/${id}/edit`),
            }}
            primaryAction={
              isDraft
                ? {
                    label: isActionPending ? "Publishing..." : "Publish",
                    icon: "/images/send.svg",
                    onClick: async () => {
                      if (!hotel || isActionPending) return;
                      setIsActionPending(true);
                      try {
                        await publishCatalogHotel(id);
                        showBanner("Hotel published successfully!");
                        refetch();
                      } catch (err) {
                        showBanner(formatBlockers(err), "warning");
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
                      if (!hotel || isActionPending) return;
                      setIsActionPending(true);
                      try {
                        await unpublishCatalogHotel(id);
                        await publishCatalogHotel(id);
                        showBanner("Hotel published successfully!");
                        refetch();
                      } catch (err) {
                        showBanner(formatBlockers(err), "warning");
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
                    icon: "/images/dashboard/delete.svg",
                    onClick: () => setIsDeleteModalOpen(true),
                  }
                : undefined
            }
          />
        </DashboardNavbar>

        <div className={styles.content}>
          {bannerMessage && (
            <DashboardStatusBanner
              message={bannerMessage}
              show={!!bannerMessage}
              onClose={() => setBannerMessage(null)}
              variant={bannerVariant}
              className={dashboardStyles.draftBanner}
            />
          )}
          <DashboardTabs tabs={tabs} ariaLabel="Hotel Tabs" />
          <LanguageTabs active={activeLang} onChange={setActiveLang} variant="white" />
          {children}
        </div>

        <DashboardFooter lastUpdateDate={hotel?.updated_at ? new Date(hotel.updated_at).toLocaleDateString() : "N/A"} hideActions className={styles.customFooter} />

        <DashboardConfirmationModal
          open={isDeleteModalOpen}
          variant="delete"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Hotel"
          message={`Are you sure you want to delete "${hotelName}"? This action cannot be undone.`}
          confirmLabel="Yes, delete it"
          cancelLabel="Keep it"
        />

        <DashboardConfirmationModal
          open={isArchiveModalOpen}
          variant="activate"
          onClose={() => setIsArchiveModalOpen(false)}
          onConfirm={handleArchiveConfirm}
          title="Archive Hotel?"
          message="The hotel will no longer be available for bookings or visible in the catalog, but you can restore it at any time."
          confirmLabel="Archive Hotel"
          cancelLabel="Cancel"
        />
      </div>
    </HotelDetailContext.Provider>
  );
}

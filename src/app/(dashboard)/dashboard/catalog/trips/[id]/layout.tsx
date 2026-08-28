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
import { useCatalogTripDetail } from "@/hooks/useCatalogTrips";
import {
  archiveCatalogTrip,
  deleteCatalogTrip,
  publishCatalogTrip,
  unpublishCatalogTrip,
} from "@/services/admin/adminCatalogTripsService";

const BLOCKER_MESSAGES: Record<string, string> = {
  "catalog.trip.missing_title": "A title is required",
  "catalog.trip.missing_slug": "A URL slug (SEO) is required",
  "catalog.trip.missing_tour_type": "At least one tour type (private or group) must be selected",
  "catalog.trip.missing_private_price": "A private tour base price is required",
  "catalog.trip.missing_group_price": "A group tour base price is required",
  "catalog.trip.missing_private_season_pricing": "At least one private season pricing entry is required",
  "catalog.trip.missing_group_season_pricing": "At least one group season pricing entry is required",
  "catalog.trip.incomplete_private_room_tiers": "Private pricing must include single, double, and triple room tiers",
  "catalog.trip.incomplete_group_room_tiers": "Group pricing must include single, double, and triple room tiers",
  "catalog.trip.missing_hotels": "At least one hotel must be linked",
  "catalog.trip.missing_hero_image": "A hero image is required",
  "catalog.trip.insufficient_gallery_images": "At least 5 gallery images are required",
  "catalog.trip.archived": "Archived trips cannot be published directly — restore to draft first",
};

function formatBlockers(err: unknown): string {
  const data = (err as { response?: { data?: { message?: string; detail?: string } } })?.response?.data;
  const message = data?.message || data?.detail || "";
  const hasBlockers = Object.keys(BLOCKER_MESSAGES).some((code) => message.includes(code));
  if (hasBlockers) {
    return "Some required fields are missing. Please fill in all required information before publishing.";
  }
  return message || "Failed to publish the trip. Please try again.";
}

// The dashboard trip detail payload is still backend-owned and wider than the shared public trip type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TripDetailContext = createContext<{ trip: any; refetch: () => void; loading: boolean; activeLang: Language }>({
  trip: null,
  refetch: () => {},
  loading: true,
  activeLang: "English",
});

export function useTripDetailContext() {
  return useContext(TripDetailContext);
}

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
  children,
}: {
  params?: any;
  children: React.ReactNode;
}) {
  const paramsObj = useParams();
  const id = (paramsObj?.id as string) || "";
  const router = useRouter();
  const pathname = usePathname();
  
  const { trip, loading, refetch } = useCatalogTripDetail(id);
  
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
  
  const isArchived = trip?.status === "archived";
  const isDraft = trip?.status === "draft";

  const showBanner = (message: string, variant: "success" | "warning" = "success") => {
    setBannerVariant(variant);
    setBannerMessage(message);
  };

  const getErrorMessage = (err: unknown, fallback: string) => {
    const data = (err as { response?: { data?: { message?: string; detail?: string; code?: string } } })?.response?.data;
    return data?.message || data?.detail || data?.code || fallback;
  };

  return (
    <TripDetailContext.Provider value={{ trip, refetch, loading, activeLang }}>
      <div className={styles.page}>
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Catalog", href: "/dashboard/catalog/trips" },
            { label: "Trips" },
          ]}
          hideSearch={true}
          hideFilterButton={true}
        >
          <ProfileHeader
            title={trip ? `${trip.trip_code || trip.id} - ${trip.title}` : "Loading..."}
            subtitleElements={trip?.short_description ? [trip.short_description] : []}
            pillLabel={isArchived ? "Archived" : (trip?.status ? trip.status.charAt(0).toUpperCase() + trip.status.slice(1) : "")}
            pillVariant={isArchived ? "orange" : isDraft ? "gray" : "green"}
            customPills={
              trip?.is_featured ? (
                <span className={styles.badgeFeatured}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.39 5.21L16.7999 8.02999C16.9899 8.41999 17.4999 8.78999 17.9299 8.86999L20.48 9.28999C22.11 9.55999 22.49 10.74 21.32 11.92L19.3299 13.91C18.9999 14.24 18.81 14.89 18.92 15.36L19.4899 17.82C19.9399 19.76 18.9 20.52 17.19 19.5L14.7999 18.08C14.3699 17.82 13.65 17.82 13.22 18.08L10.8299 19.5C9.11994 20.51 8.07995 19.76 8.52995 17.82L9.09996 15.36C9.20996 14.9 9.01995 14.25 8.68995 13.91L6.69996 11.92C5.52996 10.75 5.90996 9.56999 7.53996 9.28999L10.0899 8.86999C10.5199 8.79999 11.03 8.41999 11.22 8.02999L12.63 5.21C13.38 3.68 14.62 3.68 15.39 5.21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path opacity="0.4" d="M8 5H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path opacity="0.4" d="M5 19H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path opacity="0.4" d="M3 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> Featured
                </span>
              ) : undefined
            }
            secondaryAction={{
              label: "Edit",
              icon: "/images/dashboard/edit.svg",
              onClick: () => router.push(`/dashboard/catalog/trips/${id}/edit`),
            }}
            primaryAction={
              isDraft
                ? {
                    label: isActionPending ? "Publishing..." : "Publish",
                    icon: "/images/send.svg",
                    onClick: async () => {
                      if (!trip || isActionPending) return;
                      setIsActionPending(true);
                      try {
                        await publishCatalogTrip(trip.id);
                        showBanner("Trip published successfully!");
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
                      label: isActionPending ? "Restoring..." : "Restore to Draft",
                      icon: "/images/send.svg",
                      onClick: async () => {
                        if (!trip || isActionPending) return;
                        setIsActionPending(true);
                        try {
                          await unpublishCatalogTrip(trip.id);
                          showBanner("The trip has been restored to draft successfully");
                          refetch();
                        } catch (err) {
                          showBanner(getErrorMessage(err, "Failed to restore the trip. Please try again."), "warning");
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
        <DashboardTabs tabs={tabs} ariaLabel="Trip Tabs" />
        {!pathname?.endsWith("/pricing") && (
          <LanguageTabs active={activeLang} onChange={setActiveLang} variant="white" />
        )}
        {children}
      </div>

      <DashboardFooter lastUpdateDate={trip?.updated_at ? new Date(trip.updated_at).toLocaleDateString() : "N/A"} hideActions className={styles.customFooter} />

      <DashboardConfirmationModal
        open={isDeleteModalOpen}
        variant="delete"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (!trip || isActionPending) return;
          setIsActionPending(true);
          try {
            await deleteCatalogTrip(trip.id);
            setIsDeleteModalOpen(false);
            router.push("/dashboard/catalog/trips?deleted=true");
          } catch (err) {
            setIsDeleteModalOpen(false);
            showBanner(getErrorMessage(err, "Failed to delete the trip. Please try again."), "warning");
          } finally {
            setIsActionPending(false);
          }
        }}
        title="Delete Trip"
        message={`Are you sure you want to delete "${trip?.title || "this trip"}"? This action cannot be undone.`}
        confirmLabel={isActionPending ? "Deleting..." : "Yes, delete it"}
        cancelLabel="Keep it"
      />

      <DashboardConfirmationModal
        open={isArchiveModalOpen}
        variant="activate"
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={async () => {
          if (!trip || isActionPending) return;
          setIsActionPending(true);
          try {
            await archiveCatalogTrip(trip.id);
            setIsArchiveModalOpen(false);
            showBanner("The trip has been archived successfully");
            refetch();
          } catch (err) {
            setIsArchiveModalOpen(false);
            showBanner(getErrorMessage(err, "Failed to archive the trip. Please try again."), "warning");
          } finally {
            setIsActionPending(false);
          }
        }}
        title="Archive Trip?"
        message="The trip will no longer be available for bookings or visible in the catalog, but you can restore it at any time."
        confirmLabel={isActionPending ? "Archiving..." : "Archive Trip"}
        cancelLabel="Cancel"
      />
    </div>
    </TripDetailContext.Provider>
  );
}

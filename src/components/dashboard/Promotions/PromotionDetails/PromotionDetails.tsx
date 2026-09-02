"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import { getAdminPromotionById, deleteAdminPromotion, AdminPromotion } from "@/services/admin/adminMarketingService";
import { apiClient } from "@/lib/api";
import styles from "./PromotionDetails.module.scss";

interface PromotionDetailsProps {
  promotionId: string;
}

function EditStatusBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams?.get("editSaved") === "true") {
      setShow(true);
      router.replace(window.location.pathname);
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <DashboardStatusBanner
      show={show}
      onClose={() => setShow(false)}
      message="Your edits have been saved and are now live."
      variant="success"
      className={styles.draftBanner}
    />
  );
}

export default function PromotionDetails({ promotionId }: PromotionDetailsProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [promotion, setPromotion] = useState<AdminPromotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemsMap, setItemsMap] = useState<Record<string, Record<number, string>>>({});

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const data = await getAdminPromotionById(promotionId);
        setPromotion(data);

        // Fetch options data to map IDs to titles
        const [tripsRes, hotelsRes, transportRes] = await Promise.all([
          apiClient.get('/trips/?page_size=100'),
          apiClient.get('/hotels/?page_size=100'),
          apiClient.get('/vehicles/?page_size=100')
        ]);
        
        const tripsDataList = (tripsRes as any).results || (tripsRes as any).data?.results || [];
        const hotelsDataList = (hotelsRes as any).results || (hotelsRes as any).data?.results || [];
        const transportDataList = (transportRes as any).results || (transportRes as any).data?.results || [];
        
        setItemsMap({
          trip: tripsDataList.reduce((acc: any, t: any) => ({ ...acc, [t.id]: t.title }), {}),
          hotel: hotelsDataList.reduce((acc: any, h: any) => ({ ...acc, [h.id]: h.name }), {}),
          transport: transportDataList.reduce((acc: any, v: any) => ({ ...acc, [v.id]: v.name || v.title }), {})
        });

      } catch (error) {
        console.error("Failed to fetch promotion", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotion();
  }, [promotionId]);

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      await deleteAdminPromotion(promotionId);
      router.push("/dashboard/marketing/promotions?deleted=true");
    } catch (error) {
      console.error("Failed to delete promotion", error);
    }
  };

  const getAppliesIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hotels':
      case 'hotel':
        return '/images/dashboard/promotions/hotel.svg';
      case 'transportation':
      case 'transport':
        return '/images/dashboard/promotions/transportation.svg';
      case 'trips':
      case 'trip':
      default:
        return '/images/dashboard/promotions/trip.svg';
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading promotion details...</div>;
  }

  if (!promotion) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Promotion not found.</div>;
  }

  const appliesToTypeDisplay = promotion.applies_to === "trip" ? "Trips" : promotion.applies_to === "hotel" ? "Hotels" : "Transportation";
  const validFromDisplay = promotion.valid_from ? new Date(promotion.valid_from).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "-";
  const validToDisplay = promotion.valid_to ? new Date(promotion.valid_to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "-";
  const appliesToRules = Array.isArray(promotion.applies_to_rules) ? promotion.applies_to_rules : [];

  let derivedStatus: "Active" | "Inactive" | "Draft" | "Expired" = promotion.status === "active" ? "Active" : promotion.status === "draft" ? "Draft" : "Inactive";
  if (derivedStatus !== "Draft" && promotion.valid_to) {
    const validToDate = new Date(promotion.valid_to);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (validToDate < today) {
      derivedStatus = "Expired";
    }
  }

  return (
    <div className={styles.page}>
      <DashboardNavbar
        title=""
        breadcrumbTrail={[
          { label: "Marketing" },
          { label: "Promotions", href: "/dashboard/marketing/promotions" },
          { label: "Offer Details" },
        ]}
        hideSearch
        hideFilterButton
      >
        <ProfileHeader
          title={promotion.title || "Untitled"}
          customPills={
            <>
              <span className={styles.typePill}>
                {appliesToTypeDisplay}
              </span>
              <span className={`${styles.typePill} ${styles.statusPill} ${
                derivedStatus === "Active" ? styles.statusActive : 
                derivedStatus === "Expired" ? styles.statusExpired : 
                styles.statusGray
              }`}>
                <i aria-hidden />
                {derivedStatus}
              </span>
            </>
          }
          subtitleElements={[`Promotion ID: ${promotion.offer_number || `PRO-${promotion.id}`}`, validFromDisplay]}
          secondaryAction={{
            label: "Edit",
            icon: "/images/dashboard/edit.svg",
            onClick: () => router.push(`/dashboard/marketing/promotions/${promotionId}/edit`)
          }}
          dangerAction={{
            label: "Delete Promotion",
            icon: "/images/dashboard/delete.svg",
            iconPosition: "right",
            iconSize: 20,
            onClick: () => setIsDeleteModalOpen(true)
          }}
        />
      </DashboardNavbar>

      <React.Suspense fallback={null}>
        <EditStatusBanner />
      </React.Suspense>

      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          {/* Discount Configuration Card */}
          <div className={styles.cardSection}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <Image src="/images/dashboard/promotions/discount.svg" alt="" width={20} height={20} />
              </div>
              <h2 className={styles.cardTitle}>Discount Configuration</h2>
            </div>
            <div className={styles.detailsList}>
              <div className={styles.detailItemRow}>
                <span className={styles.detailLabel}>Discount Value</span>
                <span className={styles.detailValue}>{promotion.discount_value}%</span>
              </div>
              <div className={styles.detailItemCol}>
                <span className={styles.detailLabel}>Description</span>
                <span className={styles.detailDescValue}>{promotion.description || promotion.translations?.en?.description || "No description provided."}</span>
              </div>
            </div>
          </div>

          {/* Applies To Card */}
          <div className={styles.cardSection}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <Image src="/images/dashboard/promotions/applies.svg" alt="" width={20} height={20} />
              </div>
              <h2 className={styles.cardTitle}>Applies To</h2>
            </div>
            <div className={styles.detailsList}>
              {appliesToRules.length === 0 && (
                <div className={styles.detailItemCol}>
                  <span className={styles.detailValue} style={{ color: "var(--color-gray-500)" }}>Applied to entire category or no specific items listed.</span>
                </div>
              )}
              {appliesToRules.map((rule, idx) => (
                <div key={idx} className={styles.detailItemCol} style={{ marginTop: idx > 0 ? '12px' : 0 }}>
                  <div className={styles.detailItemRowNoBorder} style={{ paddingBottom: 0 }}>
                    <span className={styles.detailLabel}>Category</span>
                    <span className={styles.detailValue}>{rule.group_label || rule.category || "All"}</span>
                  </div>
                  <div className={styles.pillGrid}>
                    {(rule.item_ids || rule.specificTrip || []).map((item: any, i: number) => (
                      <div key={i} className={styles.appliesPill}>
                        <Image src={getAppliesIcon(promotion.applies_to)} alt="" width={18} height={18} />
                        <span>{typeof item === 'string' ? item : (itemsMap[promotion.applies_to as keyof typeof itemsMap]?.[item] || `Item ID: ${item}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          {/* Validity Period Card */}
          <div className={styles.cardSection}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <Image src="/images/dashboard/promotions/validity.svg" alt="" width={20} height={20} />
              </div>
              <h2 className={styles.cardTitle}>Validity Period</h2>
            </div>
            <div className={styles.detailsList}>
              <div className={styles.detailItemRow}>
                <span className={styles.detailLabel}>Start Date</span>
                <span className={styles.detailValue}>{validFromDisplay}</span>
              </div>
              <div className={styles.detailItemRowNoBorder}>
                <span className={styles.detailLabel}>End Date</span>
                <span className={styles.detailValue}>{validToDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardConfirmationModal
        open={isDeleteModalOpen}
        variant="delete"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Promotion"
        message={`Are you sure you want to delete "${promotion.title}"? This action cannot be undone.`}
        confirmLabel="Yes, delete it"
        cancelLabel="Keep it"
      />
    </div>
  );
}

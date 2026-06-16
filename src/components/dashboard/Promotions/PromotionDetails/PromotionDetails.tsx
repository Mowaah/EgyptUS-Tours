"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/shared";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
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

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    router.push("/dashboard/marketing/promotions?deleted=true");
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

  // Mocking the promotion details
  const promotion = {
    id: promotionId,
    offerId: "PRO-001",
    title: "Summer Special 20% Off",
    status: "Active",
    appliesToType: "Trips",
    date: "Mar 22, 2026",
    discountValue: "20 %",
    description: "A three-day business and networking event focused on innovation, technology, and strategic partnerships across the Middle East.",
    startDate: "Mar 15, 2024",
    endDate: "Mar 28, 2024",
    appliesToCategory: "Honey moon",
    appliesToItems: [
      "Luxury 5 days Luxor and Aswan Nile Cruise",
      "Luxury 5 days Luxor and Aswan Nile Cruise",
      "Best Tour of Egypt and Turkey"
    ]
  };

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
        <div className={styles.navBottomRow}>
          <div className={styles.titleColumn}>
            <div className={styles.titleRow}>
              <h1 className={styles.pageTitle}>{promotion.title}</h1>
              <span className={styles.typePill}>
                {promotion.appliesToType}
              </span>
              <span className={`${styles.statusPill} ${promotion.status === "Active" ? styles.statusActive : ""}`}>
                <i aria-hidden />
                {promotion.status}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaText}>Promotion ID: {promotion.offerId}</span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaText}>{promotion.date}</span>
            </div>
          </div>
          <div className={styles.actionsArea}>
            <button className={styles.editBtn} onClick={() => router.push(`/dashboard/marketing/promotions/${promotionId}/edit`)}>
              <Image src="/images/dashboard/edit.svg" alt="" width={20} height={20} />
              Edit
            </button>
            <button className={styles.deleteBtn} onClick={() => setIsDeleteModalOpen(true)}>
              Delete Promotion
              <Image src="/images/dashboard/delete.svg" alt="" width={20} height={20} />
            </button>
          </div>
        </div>
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
                <span className={styles.detailValue}>{promotion.discountValue}</span>
              </div>
              <div className={styles.detailItemCol}>
                <span className={styles.detailLabel}>Description</span>
                <span className={styles.detailDescValue}>{promotion.description}</span>
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
              <div className={styles.detailItemCol}>
                <div className={styles.detailItemRowNoBorder} style={{ paddingBottom: 0 }}>
                  <span className={styles.detailLabel}>Category</span>
                  <span className={styles.detailValue}>{promotion.appliesToCategory}</span>
                </div>
                <div className={styles.pillGrid}>
                  {promotion.appliesToItems.map((item, i) => (
                    <div key={i} className={styles.appliesPill}>
                      <Image src={getAppliesIcon(promotion.appliesToType)} alt="" width={18} height={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second category block to match screenshot */}
              <div className={styles.detailItemCol} style={{ marginTop: '12px' }}>
                <div className={styles.detailItemRowNoBorder} style={{ paddingBottom: 0 }}>
                  <span className={styles.detailLabel}>Category</span>
                  <span className={styles.detailValue}>{promotion.appliesToCategory}</span>
                </div>
                <div className={styles.pillGrid}>
                  {promotion.appliesToItems.map((item, i) => (
                    <div key={`second-${i}`} className={styles.appliesPill}>
                      <Image src={getAppliesIcon(promotion.appliesToType)} alt="" width={18} height={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                <span className={styles.detailValue}>{promotion.startDate}</span>
              </div>
              <div className={styles.detailItemRowNoBorder}>
                <span className={styles.detailLabel}>End Date</span>
                <span className={styles.detailValue}>{promotion.endDate}</span>
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

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal, DashboardStatusBanner } from "@/components/dashboard/shared";
import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import styles from "./PostDetails.module.scss";

export interface PostData {
  id: string;
  title: string;
  status: string;
  date: string;
  author: string;
  publishedDate: string;
  category: string;
  thumbnailTitle: string;
  thumbnailAlt: string;
  imageTitle: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  slug: string;
}

interface PostDetailsProps {
  type: "blog" | "article";
  postId: string;
  post: PostData;
}

function EditStatusBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams?.get("editSaved") === "true") {
      setShow(true);
      // Clean up the URL without triggering a full reload
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
      className={styles.editBanner}
    />
  );
}

export default function PostDetails({ type, postId, post }: PostDetailsProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isBlog = type === "blog";
  const entityName = isBlog ? "Blog" : "Article";
  const basePath = `/dashboard/marketing/${isBlog ? "blog" : "articles"}`;

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    router.push(`${basePath}?deleted=true`);
  };

  return (
    <div className={styles.page}>
      <Suspense fallback={null}>
        <EditStatusBanner />
      </Suspense>

      <DashboardNavbar
        breadcrumbTrail={[
          { label: "Marketing" },
          { label: entityName, href: basePath },
          { label: "Details" }
        ]}
      >
        <div className={styles.navBottomRow}>
          <div className={styles.titleColumn}>
            <div className={styles.titleRow}>
              <h1 className={styles.pageTitle}>{post.title}</h1>
              <span className={`${styles.statusPill} ${styles.statusPublished}`}>
                <i aria-hidden />
                {post.status}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaText}>Post ID: {post.id}</span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaText}>{post.date}</span>
            </div>
          </div>

          <div className={styles.actionsArea}>
            <button className={styles.editBtn} onClick={() => router.push(`${basePath}/${postId}/edit`)}>
              <Image src="/images/dashboard/edit.svg" alt="" width={20} height={20} />
              Edit
            </button>
            <button className={styles.deleteBtn} onClick={() => setIsDeleteModalOpen(true)}>
              Delete {entityName}
              <Image src="/images/dashboard/delete.svg" alt="" width={24} height={24} />
            </button>
          </div>
        </div>
      </DashboardNavbar>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <MetricCard card={{ label: "Total Views", value: "1,284", change: "+12.5%", trend: "up", tone: "blue", icon: "blog/eye", spark: "" }} />
        <MetricCard card={{ label: "Share", value: "34", change: "+8.2%", trend: "up", tone: "green", icon: "blog/share", spark: "" }} />
        <MetricCard card={{ label: "Read", value: "6 min", change: "+16.2%", trend: "up", tone: "purple", icon: "blog/read", spark: "" }} />
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Post Details */}
          <div className={styles.cardSection}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <Image src="/images/dashboard/blog/device-message.svg" alt="" width={20} height={20} />
              </div>
              <h2 className={styles.cardTitle}>Post Details</h2>
            </div>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Author</span>
                <span className={styles.detailValue}>{post.author}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Published</span>
                <span className={styles.detailValue}>{post.publishedDate}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{post.category}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className={styles.cardSection}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <Image src="/images/dashboard/blog/device-message.svg" alt="" width={20} height={20} />
              </div>
              <h2 className={styles.cardTitle}>Thumbnail</h2>
            </div>
            <div className={styles.imagePreviewWrapper}>
              <Image src="/images/pyramids.jpg" alt={post.thumbnailAlt} fill className={styles.previewImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.imageInfoList}>
              <div className={styles.imageInfoItem}>
                <span className={styles.imageInfoLabel}>Thumbnail Title</span>
                <span className={styles.imageInfoValue}>{post.thumbnailTitle}</span>
              </div>
              <div className={styles.imageInfoItem}>
                <span className={styles.imageInfoLabel}>Thumbnail Alt</span>
                <span className={styles.imageInfoValue}>{post.thumbnailAlt}</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className={styles.cardSection}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <Image src="/images/dashboard/blog/device-message.svg" alt="" width={20} height={20} />
              </div>
              <h2 className={styles.cardTitle}>Image</h2>
            </div>
            <div className={styles.imagePreviewWrapper}>
              <Image src="/images/pyramids.jpg" alt={post.imageAlt} fill className={styles.previewImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.imageInfoList}>
              <div className={styles.imageInfoItem}>
                <span className={styles.imageInfoLabel}>Image Title</span>
                <span className={styles.imageInfoValue}>{post.imageTitle}</span>
              </div>
              <div className={styles.imageInfoItem}>
                <span className={styles.imageInfoLabel}>Image Alt</span>
                <span className={styles.imageInfoValue}>{post.imageAlt}</span>
              </div>
            </div>
          </div>

          {/* SEO Info */}
          <div className={styles.cardSection}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <Image src="/images/dashboard/blog/device-message.svg" alt="" width={20} height={20} />
              </div>
              <h2 className={styles.cardTitle}>SEO Info</h2>
            </div>
            <div className={styles.imageInfoList}>
              <div className={styles.imageInfoItem}>
                <span className={styles.imageInfoLabel}>Meta Title</span>
                <span className={styles.imageInfoValue}>{post.metaTitle}</span>
              </div>
              <div className={styles.imageInfoItem}>
                <span className={styles.imageInfoLabel}>Meta Description</span>
                <span className={styles.imageInfoValue}>{post.metaDescription}</span>
              </div>
              <div className={styles.imageInfoItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <span className={styles.imageInfoLabel}>Meta Keywords</span>
                {post.metaKeywords ? (
                  <div className={styles.metaKeywordsContainer}>
                    {post.metaKeywords.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, idx) => (
                      <div key={idx} className={styles.metaKeywordTag}>
                        <Image src="/images/dashboard/tag.svg" alt="tag" width={18} height={18} />
                        {tag}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className={styles.imageInfoValue}>-</span>
                )}
              </div>
              <div className={styles.imageInfoItem}>
                <span className={styles.imageInfoLabel}>Slug</span>
                <span className={styles.imageInfoValue}>{post.slug}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content Preview */}
        <div className={styles.rightColumn}>
          <div className={styles.contentPreviewCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <Image src="/images/dashboard/blog/content.svg" alt="" width={20} height={20} />
              </div>
              <h2 className={styles.cardTitle}>Content Preview</h2>
            </div>
            <div className={styles.contentPreviewBody}>
              <p>Egypt isn't just a destination — it's a question of timing. The land of pharaohs shifts dramatically between seasons, offering two entirely different travel experiences separated only by a few months on the calendar. Whether you're drawn to the fierce clarity of a desert summer or the gentle warmth of a winter sun, Egypt holds something extraordinary for every kind of traveler.</p>
              
              <p>Egypt isn't just a destination — it's a question of timing. The land of pharaohs shifts dramatically between seasons, offering two entirely different travel experiences separated only by a few months on the calendar. Whether you're drawn to the fierce clarity of a desert summer or the gentle warmth of a winter sun, Egypt holds something extraordinary for every kind of traveler.</p>

              <h3>Winter: The Golden Season</h3>
              <p>From November through February, Egypt transforms into the world's most civilized outdoor museum. Temperatures in Cairo hover around a pleasant 15-22°C, while Luxor and Aswan sit warmer at 20-28°C — ideal for long afternoons exploring temple complexes without the weight of summer heat pressing down on you.</p>

              <p>The Valley of the Kings, the temples of Karnak, and the Abu Simbel complex reveal their full grandeur when you're not battling a 45°C sun. Tourist crowds are present but manageable, and the Nile cruise season is at its absolute peak — dhows and feluccas glide past golden banks in light that photographers dream about.</p>

              <h4>What winter does best</h4>
              <p>The desert nights in winter are genuinely cold, dropping to near 5°C in some areas. This creates a remarkable contrast — blazing blue skies by day, star-heavy darkness by night. Camping near the White Desert or spending a night at a desert camp in Siwa becomes a genuinely magical experience rather than a survival test.</p>

              <h3>Summer: For the Bold Traveler</h3>
              <p>Summer in Egypt is not for the faint-hearted. Cairo in July sits at 35-40°C, and Upper Egypt can push past 45°C by mid-afternoon. Yet there's a counterintuitive logic to visiting in summer: the crowds thin dramatically, prices drop across hotels and flights, and the Mediterranean coast — Alexandria, Marsa Matrouh, and the North Coast — bursts into life as Egyptians themselves seek the sea.</p>

              <p>The Red Sea resorts of Hurghada and Sharm el-Sheikh maintain excellent diving conditions year-round, but summer brings calmer winds and exceptional visibility.</p>
            </div>
          </div>
        </div>
      </div>

      <DashboardConfirmationModal
        open={isDeleteModalOpen}
        variant="delete"
        title={`Delete ${entityName}`}
        message={`Are you sure you want to delete this ${entityName}? This action cannot be undone and the ${entityName.toLowerCase()} will be permanently removed from the system.`}
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

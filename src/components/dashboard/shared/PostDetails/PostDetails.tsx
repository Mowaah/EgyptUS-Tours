"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal, DashboardStatusBanner } from "@/components/dashboard/shared";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import { deleteAdminBlog, deleteAdminArticle } from "@/services/admin/adminMarketingService";
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
  content: string;
  views: number;
  shares: number;
  readTime: number;
  heroImage: string;
  featuredImage: string;
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

  const handleConfirmDelete = async () => {
    try {
      if (isBlog) {
        await deleteAdminBlog(postId);
      } else {
        await deleteAdminArticle(postId);
      }
      setIsDeleteModalOpen(false);
      router.push(`${basePath}?deleted=true`);
    } catch (error) {
      console.error(`Failed to delete ${entityName}:`, error);
      // Optional: Add a toast notification here for failure
      setIsDeleteModalOpen(false);
    }
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
        <ProfileHeader
          title={post.title}
          pillLabel={post.status}
          pillVariant={
            post.status.toLowerCase() === "published" ? "green" :
            post.status.toLowerCase() === "scheduled" ? "blue" :
            "gray"
          }
          subtitleElements={[
            `Post ID: ${post.id}`,
            post.date && post.date !== "N/A"
              ? new Date(post.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              : post.date,
          ]}
          secondaryAction={{
            label: "Edit",
            icon: "/images/dashboard/edit.svg",
            onClick: () => router.push(`${basePath}/${postId}/edit`)
          }}
          dangerAction={{
            label: `Delete ${entityName}`,
            icon: "/images/dashboard/delete.svg",
            iconPosition: "right",
            iconSize: 24,
            onClick: () => setIsDeleteModalOpen(true)
          }}
        />
      </DashboardNavbar>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <MetricCard card={{ label: "Total Views", value: post.views.toLocaleString(), change: "", trend: "up", tone: "blue", icon: "blog/eye", spark: "" }} />
        <MetricCard card={{ label: "Shares", value: post.shares.toLocaleString(), change: "", trend: "up", tone: "green", icon: "blog/share", spark: "" }} />
        <MetricCard card={{ label: "Read Time", value: `${post.readTime} min`, change: "", trend: "up", tone: "purple", icon: "blog/read", spark: "" }} />
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
              {post.heroImage ? (
                <Image src={post.heroImage} alt={post.thumbnailAlt} fill className={styles.previewImage} style={{ objectFit: 'cover' }} unoptimized />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#999' }}>No Image Uploaded</div>
              )}
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
              {post.featuredImage ? (
                <Image src={post.featuredImage} alt={post.imageAlt} fill className={styles.previewImage} style={{ objectFit: 'cover' }} unoptimized />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#999' }}>No Image Uploaded</div>
              )}
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
            <div 
              className={styles.contentPreviewBody}
              dangerouslySetInnerHTML={{ __html: post.content || "<p>No content available.</p>" }}
            />
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

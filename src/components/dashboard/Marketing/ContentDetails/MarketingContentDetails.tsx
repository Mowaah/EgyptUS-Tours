"use client";

import React, { useEffect, useState } from "react";
import PostDetails, { PostData } from "@/components/dashboard/shared/PostDetails/PostDetails";
import { getAdminArticleById, getAdminBlogById } from "@/services/admin/adminMarketingService";
import type { ContentType } from "../types";

interface MarketingContentDetailsProps {
  contentType: ContentType;
  postId: string;
}

export function MarketingContentDetails({ contentType, postId }: MarketingContentDetailsProps) {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  const getFullImageUrl = (path: string | undefined | null) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    async function loadPost() {
      try {
        const data = contentType === "articles" 
          ? await getAdminArticleById(postId) 
          : await getAdminBlogById(postId);
        const translation = data.translations?.en ?? data;
        setPost({
          id: String(data.id || postId),
          title: translation.title || data.title || "Untitled",
          status: data.status ? (data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()) : "Draft",
          date: data.published_at || data.created_at || "N/A",
          author: data.display_author_name || "Admin",
          publishedDate: data.published_at || "N/A",
          category: data.category?.name || String(data.category ?? "Uncategorized"),
          thumbnailTitle: translation.title || data.title,
          thumbnailAlt: translation.title || data.title,
          imageTitle: translation.title || data.title,
          imageAlt: translation.title || data.title,
          metaTitle: data.meta_title || translation.title || data.title,
          metaDescription: data.meta_description || translation.short_description || data.excerpt || "",
          metaKeywords: Array.isArray(data.meta_keywords) ? data.meta_keywords.join(', ') : (data.meta_keywords || ""),
          slug: data.slug || "",
          content: translation.content || data.content || "",
          views: data.views_count || 0,
          shares: data.shares_count || 0,
          readTime: data.read_time_minutes || 0,
          heroImage: getFullImageUrl(data.hero_image),
          featuredImage: getFullImageUrl(data.featured_image),
        });
      } catch (error) {
        console.error(`Failed to load ${contentType} details:`, error);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [postId, contentType]);

  if (loading) {
    return <div>Loading {contentType === "articles" ? "Article" : "Blog Post"}...</div>;
  }

  if (!post) {
    return <div>Failed to load details.</div>;
  }

  return <PostDetails type={contentType === "articles" ? "article" : "blog"} postId={postId} post={post} />;
}

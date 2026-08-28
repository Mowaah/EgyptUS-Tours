"use client";

import React, { useEffect, useState } from "react";
import PostDetails, { PostData } from "@/components/dashboard/shared/PostDetails/PostDetails";
import { getAdminArticleById, getAdminBlogById } from "@/services/admin/adminMarketingService";
import type { ContentType } from "../types";
import { getAdminUsers } from "@/services/admin/adminUsersService";

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
        const [data, usersData] = await Promise.all([
          contentType === "articles" ? getAdminArticleById(postId) : getAdminBlogById(postId),
          getAdminUsers().catch(() => ({ results: [] }))
        ]);
        
        const translation = data.translations?.en ?? data;
        
        const formatDate = (dateString?: string) => {
          if (!dateString) return "N/A";
          const date = new Date(dateString);
          if (Number.isNaN(date.getTime())) return dateString;
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          });
        };

        let authorName = data.display_author_name || "Admin";
        if (data.author && typeof data.author === "object") {
          authorName = data.author.display_name || data.author.full_name || data.author.first_name || data.author.email || authorName;
        } else {
          // Find user by ID in usersData
          const authorId = data.author_id || data.author;
          if (authorId) {
            const users = Array.isArray(usersData) ? usersData : (usersData?.results ?? []);
            const user = users.find((u: any) => String(u.staff_profile_id) === String(authorId) || String(u.id) === String(authorId));
            if (user) {
              authorName = user.full_name || user.email || authorName;
            }
          }
        }

        setPost({
          id: String(data.id || postId),
          title: translation.title || data.title || "Untitled",
          status: data.status ? (data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()) : "Draft",
          date: formatDate(data.published_at || data.created_at),
          author: authorName,
          publishedDate: formatDate(data.published_at),
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

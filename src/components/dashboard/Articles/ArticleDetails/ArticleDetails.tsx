"use client";

import React from "react";
import PostDetails, { PostData } from "@/components/dashboard/shared/PostDetails/PostDetails";

interface ArticleDetailsProps {
  postId: string;
}

export default function ArticleDetails({ postId }: ArticleDetailsProps) {
  // Mocking the post details
  const post: PostData = {
    id: postId,
    title: "Top 10 Things to Do in Cairo",
    status: "Published",
    date: "Mar 22, 2026",
    author: "Sara M.",
    publishedDate: "Mar 15, 2024",
    category: "Destination",
    thumbnailTitle: "10 Top- Rated Tourist Attractions in Egypt",
    thumbnailAlt: "10 Top- Rated Tourist Attractions in Egypt",
    imageTitle: "10 Top- Rated Tourist Attractions in Egypt",
    imageAlt: "10 Top- Rated Tourist Attractions in Egypt",
    metaTitle: "Top 10 Things to Do in Cairo | Egypt Tourism Article",
    metaDescription: "Discover the best experiences Cairo has to offer, from ancient pyramids to vibrant bazaars.",
    metaKeywords: "Cairo, Egypt, Tourism, Pyramids, Travel Guide",
    slug: "top-10-things-to-do-in-cairo",
  };

  return <PostDetails type="article" postId={postId} post={post} />;
}

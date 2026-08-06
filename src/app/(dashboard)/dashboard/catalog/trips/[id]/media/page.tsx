"use client";

import React from "react";
import { useTripDetailContext } from "../layout";
import { CatalogMediaView, MediaCardItem } from "@/components/dashboard/shared";

interface TripMediaItem {
  id?: number | string;
  kind?: string;
  image_url?: string;
  caption?: string;
  translations?: {
    en?: {
      alt?: string;
      title?: string;
      caption?: string;
    };
  };
}

export default function TripMediaPage() {
  const { trip, loading } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const mediaItems: TripMediaItem[] = trip.media_items || [];
  const heroImageUrl = trip.hero_image_url;

  const cards: MediaCardItem[] = [];

  if (heroImageUrl) {
    cards.push({
      id: "hero",
      title: "Hero / Banner Image",
      imageSrc: heroImageUrl,
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleLabel: "Caption / Title",
      imgTitleValue: trip.title,
      imgAltLabel: "Image Type",
      imgAltValue: "Hero Banner",
    });
  }

  mediaItems.forEach((item, idx: number) => {
    const kindLabel = item.kind === "hero" ? "Hero Image" : item.kind === "traveler_photo" ? "Traveler Photo" : `Gallery Photo ${idx + 1}`;
    const translated = item.translations?.en || {};
    cards.push({
      id: item.id || idx,
      title: kindLabel,
      imageSrc: item.image_url || "",
      attachmentInfo: item.kind === "hero" ? "Attachment (303 x 202)" : "Attachment (1100 x 552)",
      imgTitleValue: translated.title || item.caption || "No title",
      imgAltValue: translated.alt || item.caption || item.kind || "gallery",
    });
  });

  return (
    <CatalogMediaView
      pageTitle="Media & Gallery"
      mediaItems={cards}
      emptyMessage="No media items or hero images have been uploaded for this trip yet."
    />
  );
}

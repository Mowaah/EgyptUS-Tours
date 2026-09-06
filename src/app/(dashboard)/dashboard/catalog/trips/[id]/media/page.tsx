"use client";

import React from "react";
import { useTripDetailContext } from "../layout";
import { CatalogMediaView, MediaCardItem } from "@/components/dashboard/shared";

import { getLangKey } from "@/components/dashboard/shared/i18n";

export default function TripMediaPage() {
  const { trip, loading, activeLang } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const langKey = getLangKey(activeLang);
  const rawMediaItems: any[] = Array.isArray(trip?.media_items) ? trip.media_items : [];

  const heroMedia =
    rawMediaItems.find((m) => m?.kind === "hero") ||
    (trip?.hero_image_url ? { image_url: trip.hero_image_url, kind: "hero" } : null);
  const galleryMedia = rawMediaItems.filter((m) => m?.kind !== "hero");

  const mediaList = [heroMedia, ...galleryMedia].filter(Boolean);

  const cards: MediaCardItem[] = mediaList.map((item, index) => {
    const isHero = index === 0;
    const mediaTranslations = item?.translations?.[langKey] || item?.translations?.en || {};
    const title = isHero ? "Thumbnail" : `Photo Gallery ${index}`;
    const attachmentInfo = isHero ? "Attachment (303 x 202)" : "Attachment (1100 x 552)";
    const imageSrc = item?.image_url || item?.image || item?.file || "/images/placeholder.jpg";
    const imgTitleValue = mediaTranslations.title || item?.caption || (isHero ? trip.title : "") || "-";
    const imgAltValue = mediaTranslations.alt || "-";

    return {
      id: item?.id || index,
      title,
      imageSrc,
      attachmentInfo,
      imgTitleValue,
      imgAltValue,
    };
  });

  return (
    <CatalogMediaView
      pageTitle="Trips Media"
      headerIconSrc="/images/dashboard/catalog/trips/media.svg"
      mediaItems={cards}
      emptyMessage="No media items or hero images have been uploaded for this trip yet."
    />
  );
}

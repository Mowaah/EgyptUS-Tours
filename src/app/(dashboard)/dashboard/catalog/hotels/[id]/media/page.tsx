"use client";

import React from "react";
import { useHotelDetailContext } from "../layout";
import { CatalogMediaView, MediaCardItem } from "@/components/dashboard/shared";
import { getLangKey } from "@/components/dashboard/shared/i18n";

export default function HotelMediaPage() {
    const { hotel, loading, activeLang } = useHotelDetailContext();

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading media...</div>;
  }

  const langKey = getLangKey(activeLang);
  const rawMediaItems: any[] = Array.isArray(hotel?.media_items) ? hotel.media_items : [];

  const heroMedia = rawMediaItems.find((m) => m?.kind === "hero") || (hotel?.hero_image_url ? { image_url: hotel?.hero_image_url, kind: "hero" } : null);
  const galleryMedia = rawMediaItems.filter((m) => m?.kind === "gallery");

  const mediaList = [heroMedia, ...galleryMedia].filter(Boolean);

  const cards: MediaCardItem[] = mediaList.map((item, index) => {
    const isHero = index === 0;
    const mediaTranslations = item?.translations?.[langKey] || item?.translations?.en || {};
    const title = isHero ? "Upload Thumbnail" : index === 1 ? "Upload Image" : `Photo Gallery ${index}`;
    const attachmentInfo = isHero ? "Attachment (303 x 202)" : "Attachment (1100 x 552)";
    const imageSrc = item?.image_url || item?.image || item?.file || "/images/dashboard/catalog/hotels/roomtype.jpg";
    const imgTitleValue = mediaTranslations.title || item?.caption || "";
    const imgAltValue = mediaTranslations.alt || "";

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
      pageTitle="Hotel Media"
      mediaItems={cards}
      emptyMessage="No media items uploaded for this hotel yet."
    />
  );
}

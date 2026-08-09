"use client";

import React from "react";
import { useVehicleDetailContext } from "../layout";
import { CatalogMediaView, MediaCardItem } from "@/components/dashboard/shared";
import { getLangKey } from "@/components/dashboard/shared/i18n";

export default function TransportationMediaPage() {
  const { vehicle, loading, activeLang } = useVehicleDetailContext();

  if (loading) return <div style={{ padding: "24px" }}>Loading media...</div>;
  if (!vehicle) return <div style={{ padding: "24px" }}>Vehicle not found.</div>;

  const langKey = getLangKey(activeLang);
  const mediaItems = vehicle.media_items || [];
  const heroItem = mediaItems.find((m: any) => m.kind === "hero");
  const galleryItems = mediaItems.filter((m: any) => m.kind !== "hero" && m.kind !== "thumbnail");

  const cards: MediaCardItem[] = [];

  if (heroItem) {
    const t = heroItem.translations?.[langKey] || heroItem.translations?.en || {};
    cards.push({
      id: heroItem.id || "hero",
      title: "Upload Thumbnail",
      imageSrc: heroItem.image_url || "/images/placeholder.jpg",
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleValue: t.title || "-",
      imgAltValue: t.alt || "-",
    });
  }

  galleryItems.forEach((item: any, index: number) => {
    const t = item.translations?.[langKey] || item.translations?.en || {};
    cards.push({
      id: item.id || `gallery-${index}`,
      title: `Photo Gallery ${index + 2}`,
      imageSrc: item.image_url || "/images/placeholder.jpg",
      attachmentInfo: "Attachment (1100 x 552)",
      imgTitleValue: t.title || "-",
      imgAltValue: t.alt || "-",
    });
  });

  return (
    <CatalogMediaView
      pageTitle="Vehicle Media"
      headerIconSrc="/images/dashboard/catalog/trips/media.svg"
      mediaItems={cards}
      emptyMessage="No media uploaded for this vehicle."
    />
  );
}

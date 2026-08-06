"use client";

import React from "react";
import { useVehicleDetailContext } from "../layout";
import { CatalogMediaView, MediaCardItem } from "@/components/dashboard/shared";

export default function TransportationMediaPage() {
  const { vehicle, loading } = useVehicleDetailContext();

  if (loading) return <div style={{ padding: "24px" }}>Loading media...</div>;
  if (!vehicle) return <div style={{ padding: "24px" }}>Vehicle not found.</div>;

  const mediaItems = vehicle.media_items || [];
  const heroItem = mediaItems.find((m: any) => m.kind === "hero");
  const galleryItems = mediaItems.filter((m: any) => m.kind !== "hero");

  const cards: MediaCardItem[] = [];

  if (heroItem) {
    cards.push({
      id: heroItem.id || "hero",
      title: "Upload Thumbnail",
      imageSrc: heroItem.image_url || "/images/placeholder.jpg",
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleValue: heroItem.translations?.en?.title || "-",
      imgAltValue: heroItem.translations?.en?.alt || "-",
    });
  }

  galleryItems.forEach((item: any, index: number) => {
    cards.push({
      id: item.id || `gallery-${index}`,
      title: `Photo Gallery ${index + 2}`,
      imageSrc: item.image_url || "/images/placeholder.jpg",
      attachmentInfo: "Attachment (1100 x 552)",
      imgTitleValue: item.translations?.en?.title || "-",
      imgAltValue: item.translations?.en?.alt || "-",
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

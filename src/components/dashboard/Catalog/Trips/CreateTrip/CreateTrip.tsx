/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTripSchema, type CreateTripValues } from "./CreateTripSchema";
import { OverviewStep } from "./Steps/Overview/OverviewStep";
import { InclusionsStep } from "./Steps/Inclusions/InclusionsStep";
import { PricingStep } from "./Steps/Pricing/PricingStep";
import { ItineraryStep } from "./Steps/Itinerary/ItineraryStep";
import { DatesAvailabilityStep } from "./Steps/DatesAvailability/DatesAvailabilityStep";
import { HotelsStep } from "./Steps/Hotels/HotelsStep";
import { WizardMediaStep } from "@/components/dashboard/shared";
import { SEOStep } from "./Steps/SEO/SEOStep";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { WizardLayout } from "@/components/dashboard/shared";
import { useWizard, WizardStepConfig, WizardSubmitIntent } from "@/hooks/useWizard";
import {
  createCatalogTrip,
  getCatalogTripDetail,
  publishCatalogTrip,
  updateTripBrochure,
  updateCatalogTrip,
} from "@/services/admin/adminCatalogTripsService";
import { getCategories } from "@/services/admin/adminCatalogCategoriesService";
import { getDestinations } from "@/services/admin/adminCatalogDestinationsService";
import styles from "./CreateTrip.module.scss";

const STEPS: WizardStepConfig[] = [
  { label: "Overview", iconSrc: "/images/dashboard/catalog/trips/overview.svg", fieldsToValidate: ["tripName", "category", "destinations", "duration", "tourTypes", "description", "culturalValue", "whoIsTripFor"] },
  { label: "Inclusions", iconSrc: "/images/dashboard/catalog/trips/inclusions.svg", fieldsToValidate: ["inclusions", "exclusions"] },
  { label: "Pricing", iconSrc: "/images/dashboard/catalog/trips/pricing.svg", fieldsToValidate: ["pricing"] },
  { label: "Itinerary", iconSrc: "/images/dashboard/catalog/trips/itinerary.svg", fieldsToValidate: ["itinerary"] },
  { label: "Dates Availability", iconSrc: "/images/dashboard/catalog/trips/dates.svg", fieldsToValidate: ["datesAvailability"] },
  { label: "Hotels", iconSrc: "/images/dashboard/catalog/trips/hotels.svg", fieldsToValidate: ["hotels"] },
  { label: "Media", iconSrc: "/images/dashboard/catalog/trips/media.svg", fieldsToValidate: ["photos"] },
  { label: "SEO", iconSrc: "/images/dashboard/catalog/trips/seo.svg", fieldsToValidate: ["metaTitle", "metaDescription", "metaKeywords", "slug"] },
];

const REQUIRED_GALLERY_IMAGES = 5;

const EMPTY_VALUES: CreateTripValues = {
  tripName: { en: "", it: "", es: "" },
  category: "",
  destinations: [],
  duration: "",
  tourTypes: [],
  starRating: "",
  brochureFile: undefined,
  description: { en: "", it: "", es: "" },
  culturalValue: { en: "", it: "", es: "" },
  whoIsTripFor: { en: "", it: "", es: "" },
  inclusions: [],
  exclusions: [],
  pricing: {
    privateTour: { basePrice: "", seasons: [{ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" }] },
    groupTour: { basePrice: "", seasons: [{ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" }] },
  },
  itinerary: [{ title: { en: "", it: "", es: "" }, subtitle: { en: "", it: "", es: "" }, description: { en: "", it: "", es: "" }, highlights: [], image: undefined }],
  hotels: [],
  photos: [
    { file: undefined, title: "", alt: "" }, // index 0 = hero
    { file: undefined, title: "", alt: "" }, // index 1 = gallery 1
    { file: undefined, title: "", alt: "" }, // index 2 = gallery 2
    { file: undefined, title: "", alt: "" }, // index 3 = gallery 3
    { file: undefined, title: "", alt: "" }, // index 4 = gallery 4
    { file: undefined, title: "", alt: "" }, // index 5 = gallery 5
  ],
  datesAvailability: { enabled: false, dates: [] },
  metaTitle: { en: "", it: "", es: "" },
  metaDescription: { en: "", it: "", es: "" },
  metaKeywords: { en: "", it: "", es: "" },
  slug: { en: "", it: "", es: "" },
};

function asList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  return [];
}

function asText(value: any): string {
  return value === null || value === undefined ? "" : String(value);
}

function money(value: any): string | undefined {
  const cleaned = asText(value).replace(/[^0-9.]/g, "");
  return cleaned || undefined;
}

function intValue(value: any): number | undefined {
  const number = parseInt(asText(value).replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(number) ? number : undefined;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function isFile(value: any): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function itemName(item: any): string {
  return asText(item?.name || item?.title || item?.translations?.en?.name || item?.translations?.en?.title);
}

function resolveId(value: string, records: any[]): number | undefined {
  const normalized = value.toLowerCase();
  const found = records.find((record) => {
    const candidates = [
      asText(record?.id),
      asText(record?.slug),
      slugify(itemName(record)),
      itemName(record).toLowerCase(),
    ].filter(Boolean);

    return candidates.includes(normalized);
  });

  return found?.id ? Number(found.id) : undefined;
}

function parseDuration(value: string): { days: number; nights: number } {
  const byCompact = value.match(/(\d+)\s*d.*?(\d+)\s*n/i);
  const byWords = value.match(/(\d+).*?days?.*?(\d+).*?nights?/i);
  const match = byCompact || byWords;
  return {
    days: match ? Number(match[1]) : 1,
    nights: match ? Number(match[2]) : 0,
  };
}

function normalizeDate(value: string): string | undefined {
  const text = value.trim();
  if (!text) return undefined;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function parseDateRange(value: string): { start_date?: string; end_date?: string; label: string } {
  const label = value.trim();
  const parts = label.split(/\s+(?:-|to|–|—)\s+/i).map((part) => part.trim()).filter(Boolean);
  return {
    start_date: normalizeDate(parts[0] || ""),
    end_date: normalizeDate(parts[1] || parts[0] || ""),
    label,
  };
}

function keywords(value: string | undefined): string[] {
  return asText(value)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}
const MIN_PHOTOS = 6; // 1 hero + 5 gallery
function padPhotos(rows: any[]): any[] {
  const result = [...rows];
  while (result.length < MIN_PHOTOS) {
    result.push({ file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } });
  }
  return result;
}


function validateMediaBeforeSave(data: CreateTripValues, intent: WizardSubmitIntent): string[] {
  const errors: string[] = [];
  const photos = data.photos || [];

  if (intent === "publish") {
    const hasHero = !!(photos[0] as any)?.file;
    const galleryCount = photos.slice(1).filter((photo: any) => !!photo?.file).length;

    if (!hasHero) {
      errors.push("Media: upload 1 thumbnail/hero image before publishing.");
    }
    if (galleryCount < REQUIRED_GALLERY_IMAGES) {
      errors.push(`Media: upload at least ${REQUIRED_GALLERY_IMAGES} gallery images before publishing.`);
    }
  }

  return errors;
}

function rowText(row: any): string {
  return asText(row?.text || row?.translations?.en?.text || row);
}

function mapTripToFormValues(trip: any): CreateTripValues {
  const tEn = trip?.translations?.en || {};
  const tIt = trip?.translations?.it || {};
  const tEs = trip?.translations?.es || {};
  
  const overviewEn = tEn.overview || trip?.overview || {};
  const overviewIt = tIt.overview || {};
  const overviewEs = tEs.overview || {};
  const duration = trip?.duration_days ? `${trip.duration_days}d-${trip.duration_nights || 0}n` : "";
  const seasonRows = asList(trip?.season_pricings);
  const mediaRows = asList(trip?.media_items).sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0));
  const heroMedia = mediaRows.find((media) => media?.kind === "hero");
  const galleryMedia = mediaRows.filter((media) => media?.kind === "gallery");
  const photoRows = [heroMedia, ...galleryMedia]
    .filter(Boolean)
    .map((media) => {
      const tEn = media?.translations?.en || {};
      const tIt = media?.translations?.it || {};
      const tEs = media?.translations?.es || {};
      return {
        id: media?.id,
        kind: media?.kind,
        file: media?.image_url,
        title: { en: asText(tEn.title || media?.caption), it: asText(tIt.title), es: asText(tEs.title) },
        alt: { en: asText(tEn.alt), it: asText(tIt.alt), es: asText(tEs.alt) },
      };
    });

  const seasonValues = (tourType: string) => {
    const rows = seasonRows.filter((season) => asText(season?.tour_type).toLowerCase() === tourType);
    return rows.length
      ? rows.map((season) => {
          const tiers = asList(season?.tiers);
          const byLabel = (label: string) => money(tiers.find((tier) => asText(tier?.label).toLowerCase().includes(label))?.price) || "";
          return {
            dateRange: asText(season?.season_label || [season?.start_date, season?.end_date].filter(Boolean).join(" - ")),
            singleRoom: byLabel("single"),
            doubleRoom: byLabel("double"),
            tripleRoom: byLabel("triple"),
          };
        })
      : [{ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" }];
  };

  return {
    ...EMPTY_VALUES,
    tripName: { en: asText(tEn.title || trip?.title), it: asText(tIt.title), es: asText(tEs.title) },
    category: asText(trip?.tags?.[0]?.slug || trip?.tags?.[0]?.id || ""),
    destinations: asList(trip?.destinations).map((destination) => asText(destination?.slug || destination?.id)).filter(Boolean),
    duration: trip?.duration_days ? `${trip.duration_days}d-${trip.duration_nights || 0}n` : "",
    tourTypes: [
      trip?.offers_private_tour ? "private-tour" : "",
      trip?.offers_group_tour ? "group-tour" : "",
    ].filter(Boolean),
    starRating: trip?.rating_avg ? String(trip.rating_avg) : "",
    description: { en: asText(overviewEn.description || trip?.description), it: asText(overviewIt.description), es: asText(overviewEs.description) },
    culturalValue: { en: asText(overviewEn.cultural_value), it: asText(overviewIt.cultural_value), es: asText(overviewEs.cultural_value) },
    whoIsTripFor: { en: asText(overviewEn.who_is_it_for), it: asText(overviewIt.who_is_it_for), es: asText(overviewEs.who_is_it_for) },
    inclusions: asList(trip?.inclusions).map(row => ({
      en: asText(row?.translations?.en?.text || row?.text || ""),
      it: asText(row?.translations?.it?.text || ""),
      es: asText(row?.translations?.es?.text || ""),
    })),
    exclusions: asList(trip?.exclusions).map(row => ({
      en: asText(row?.translations?.en?.text || row?.text || ""),
      it: asText(row?.translations?.it?.text || ""),
      es: asText(row?.translations?.es?.text || ""),
    })),
    pricing: {
      privateTour: { basePrice: money(trip?.private_price) || "", seasons: seasonValues("private") },
      groupTour: { basePrice: money(trip?.group_price) || "", seasons: seasonValues("group") },
    },
    itinerary: asList(trip?.itinerary_days).map((day) => ({
      id: day?.id,
      title: {
        en: asText(day?.translations?.en?.title || day?.title),
        it: asText(day?.translations?.it?.title),
        es: asText(day?.translations?.es?.title),
      },
      subtitle: {
        en: asText(day?.translations?.en?.subtitle || day?.subtitle),
        it: asText(day?.translations?.it?.subtitle),
        es: asText(day?.translations?.es?.subtitle),
      },
      description: {
        en: asText(day?.translations?.en?.description || day?.description),
        it: asText(day?.translations?.it?.description),
        es: asText(day?.translations?.es?.description),
      },
      highlights: asList(day?.translations?.en?.highlights || day?.highlights).map(h => ({ en: asText(h), it: "", es: "" })), // Complex nested mapping
      image: day?.image_url,
    })),
    datesAvailability: {
      enabled: !!trip?.availability_enabled,
      dates: asList(trip?.availability_slots).map((slot) => {
        const formatYMD = (val?: string) => {
          if (!val) return "";
          const parts = val.split("-").map(Number);
          if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
            const [y, m, d] = parts;
            return `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}/${y}`;
          }
          return val;
        };
        const sDate = formatYMD(slot?.start_date);
        const eDate = formatYMD(slot?.end_date);
        return {
          id: slot?.id,
          dateRange: [sDate, eDate].filter(Boolean).join(" - "),
          spots: asText(slot?.capacity_total || slot?.spots || ""),
        };
      }),
    },
    hotels: asList(trip?.hotel_links).map((link: any) => asText(link?.hotel?.hotel_id || link?.hotel?.id || link?.hotel_id)).filter(Boolean),
    photos: padPhotos(photoRows),
    metaTitle: { en: asText(tEn.meta_title), it: asText(tIt.meta_title), es: asText(tEs.meta_title) },
    metaDescription: { en: asText(tEn.meta_description), it: asText(tIt.meta_description), es: asText(tEs.meta_description) },
    metaKeywords: { 
      en: asList(tEn.meta_keywords).join(", "),
      it: asList(tIt.meta_keywords).join(", "),
      es: asList(tEs.meta_keywords).join(", ")
    },
    slug: { en: asText(tEn.slug || trip?.slug), it: asText(tIt.slug), es: asText(tEs.slug) },
    brochureFile: trip?.brochure_url || undefined,
  };
}

async function buildPayload(data: CreateTripValues, intent: WizardSubmitIntent, isEdit: boolean = false) {
  const [categoriesPayload, destinationsPayload] = await Promise.all([
    getCategories({ page_size: 100 }),
    getDestinations({ page_size: 100 }),
  ]);
  const categoryRecords = asList(categoriesPayload);
  const destinationRecords = asList(destinationsPayload);
  const tagId = resolveId(data.category, categoryRecords);
  const destinationIds = (data.destinations || [])
    .map((destination) => resolveId(destination, destinationRecords))
    .filter((id): id is number => !!id);
  const unresolvedDestinations = (data.destinations || []).filter((destination) => !resolveId(destination, destinationRecords));

  if (!tagId) {
    throw new Error("The selected category does not exist in the backend yet.");
  }
  if (unresolvedDestinations.length) {
    throw new Error(`These destinations do not exist in the backend yet: ${unresolvedDestinations.join(", ")}`);
  }

  const durationStr = typeof data.duration === 'string' ? data.duration : "";
  const durationDays = durationStr ? parseInt(durationStr.split('d')[0], 10) || 0 : 0;
  const durationNights = durationStr && durationStr.includes('-') ? parseInt(durationStr.split('-')[1].split('n')[0], 10) || 0 : 0;
  const tourTypes = data.tourTypes || [];
  const photos = await Promise.all(
    (data.photos || [])
      .map(async (photo: any, index: number) => {
        if (!photo?.file && !photo?.id) return null;
        return {
          id: photo.id,
          kind: index === 0 ? "hero" : "gallery",
          image: isFile(photo.file) ? await fileToDataUrl(photo.file) : undefined,
          translations: {
            en: { title: photo.title?.en || "", alt: photo.alt?.en || "" },
            it: { title: photo.title?.it || "", alt: photo.alt?.it || "" },
            es: { title: photo.title?.es || "", alt: photo.alt?.es || "" },
          },
          order: index,
        };
      })
  );
  const itinerary = await Promise.all(
    (data.itinerary || [])
      .filter((day) => day?.title || day?.description)
      .map(async (day, index) => ({
        id: (day as any).id,
        day_number: index + 1,
        title: day.title?.en || "",
        subtitle: day.subtitle?.en || "",
        description: day.description?.en || "",
        highlights: (day.highlights || []).map(h => h.en || "").filter(Boolean),
        image: isFile(day.image) ? await fileToDataUrl(day.image) : undefined,
        order: index,
        translations: {
          en: {
            title: day.title?.en || "",
            subtitle: day.subtitle?.en || "",
            description: day.description?.en || "",
            highlights: (day.highlights || []).map(h => h.en || "").filter(Boolean),
          },
          it: {
            title: day.title?.it || "",
            subtitle: day.subtitle?.it || "",
            description: day.description?.it || "",
            highlights: (day.highlights || []).map(h => h.it || "").filter(Boolean),
          },
          es: {
            title: day.title?.es || "",
            subtitle: day.subtitle?.es || "",
            description: day.description?.es || "",
            highlights: (day.highlights || []).map(h => h.es || "").filter(Boolean),
          },
        }
      }))
  );

  const seasonRows = [
    ...(data.pricing?.privateTour?.seasons || []).map((season) => ({ ...season, tourType: "private" })),
    ...(data.pricing?.groupTour?.seasons || []).map((season) => ({ ...season, tourType: "group" })),
  ].filter((season) => season.dateRange || season.singleRoom || season.doubleRoom || season.tripleRoom);

  const userSlugEn = data.slug?.en ? slugify(data.slug.en) : "";
  const baseSlugEn = slugify(data.tripName?.en || "trip");
  const slugEn = userSlugEn || (isEdit ? baseSlugEn : `${baseSlugEn}-${Math.random().toString(36).substring(2, 6)}`);

  const buildOverview = (lang: "en" | "it" | "es") => ({
    description: data.description?.[lang] || "",
    cultural_value: data.culturalValue?.[lang] || "",
    who_is_it_for: data.whoIsTripFor?.[lang] || "",
  });

  const selectedDestinationNames = destinationIds
    .map((id) => destinationRecords.find((d: any) => d.id === id)?.name || destinationRecords.find((d: any) => d.id === id)?.title)
    .filter(Boolean);
  const locationText = selectedDestinationNames.join(" · ") || "Egypt";

  return {
    translations: {
      en: {
        title: data.tripName?.en || "",
        slug: slugEn,
        description: data.description?.en || "",
        short_description: data.culturalValue?.en || "",
        location_text: locationText,
        overview: buildOverview("en"),
        meta_title: data.metaTitle?.en || "",
        meta_description: data.metaDescription?.en || "",
        meta_keywords: keywords(data.metaKeywords?.en),
      },
      it: {
        title: data.tripName?.it || "",
        slug: data.slug?.it || "",
        description: data.description?.it || "",
        short_description: data.culturalValue?.it || "",
        location_text: locationText,
        overview: buildOverview("it"),
        meta_title: data.metaTitle?.it || "",
        meta_description: data.metaDescription?.it || "",
        meta_keywords: keywords(data.metaKeywords?.it),
      },
      es: {
        title: data.tripName?.es || "",
        slug: data.slug?.es || "",
        description: data.description?.es || "",
        short_description: data.culturalValue?.es || "",
        location_text: locationText,
        overview: buildOverview("es"),
        meta_title: data.metaTitle?.es || "",
        meta_description: data.metaDescription?.es || "",
        meta_keywords: keywords(data.metaKeywords?.es),
      },
    },
    tag_ids: [tagId],
    destination_ids: destinationIds,
    duration_days: durationDays || 1,
    duration_nights: durationNights || 0,
    offers_private_tour: tourTypes.includes("private-tour"),
    offers_group_tour: tourTypes.includes("group-tour"),
    private_price: money(data.pricing?.privateTour?.basePrice) || null,
    group_price: money(data.pricing?.groupTour?.basePrice) || null,
    base_price: Math.min(
      Number(money(data.pricing?.groupTour?.basePrice) || Infinity),
      Number(money(data.pricing?.privateTour?.basePrice) || Infinity)
    ) === Infinity ? null : Math.min(
      Number(money(data.pricing?.groupTour?.basePrice) || Infinity),
      Number(money(data.pricing?.privateTour?.basePrice) || Infinity)
    ).toString(),
    rating_avg: data.starRating ? parseFloat(data.starRating) : null,
    currency_code: "USD",
    availability_enabled: !!data.datesAvailability?.enabled,
    force_draft: intent !== "publish" && !isEdit,
    inclusions: (data.inclusions || []).map(inc => ({
      text: inc.en || "", // Fallback
      translations: {
        en: { text: inc.en || "" },
        it: { text: inc.it || "" },
        es: { text: inc.es || "" },
      }
    })).filter(inc => inc.text),
    exclusions: (data.exclusions || []).map(exc => ({
      text: exc.en || "", // Fallback
      translations: {
        en: { text: exc.en || "" },
        it: { text: exc.it || "" },
        es: { text: exc.es || "" },
      }
    })).filter(exc => exc.text),
    season_pricings: seasonRows.map((season, index) => {
      const range = parseDateRange(season.dateRange || "");
      return {
        tour_type: season.tourType,
        season_label: range.label || `Season ${index + 1}`,
        start_date: range.start_date,
        end_date: range.end_date,
        order: index,
        tiers: [
          { label: "Single Room", price: money(season.singleRoom), order: 0 },
          { label: "Double Room", price: money(season.doubleRoom), order: 1 },
          { label: "Triple Room", price: money(season.tripleRoom), order: 2 },
        ].filter((tier) => tier.price),
      };
    }),
    itinerary_days: itinerary,
    availability_slots: data.datesAvailability?.enabled
      ? (data.datesAvailability?.dates || [])
          .map((slot, index) => {
            const range = parseDateRange(slot.dateRange || "");
            const capacity = intValue(slot.spots);
            if (!range.start_date || !range.end_date || capacity === undefined) return null;
            return {
              id: (slot as any).id,
              start_date: range.start_date,
              end_date: range.end_date,
              capacity_total: capacity,
              capacity_remaining: capacity,
              order: index,
            };
          })
          .filter(Boolean)
      : [],
    hotel_ids: (data.hotels || []).map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0),
    media_items: photos.filter(Boolean),
    replace_bullets: true,
    replace_season_pricings: true,
    replace_itinerary_days: true,
    replace_availability_slots: true,
    replace_hotel_links: true,
    replace_media_items: true,
  };
}

function humanFieldName(path: string): string {
  return path
    .replace(/^translations\.en\./, "")
    .replace(/_/g, " ")
    .replace(/\.\d+\./g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function humanBackendMessage(message: string): string {
  if (typeof message === "string" && (message.includes("uniq_trip_availability_window") || message.includes("duplicate key value violates unique constraint"))) {
    return "A departure date slot with this exact date range already exists. Please choose a different date range.";
  }

  const blockerLabels: Record<string, string> = {
    "catalog.trip.missing_title": "Trip title is required.",
    "catalog.trip.missing_tour_type": "Select at least one tour type.",
    "catalog.trip.missing_private_price": "Private tour base price is required.",
    "catalog.trip.missing_group_price": "Group tour base price is required.",
    "catalog.trip.missing_private_season_pricing": "Private tour season pricing is required.",
    "catalog.trip.missing_group_season_pricing": "Group tour season pricing is required.",
    "catalog.trip.incomplete_private_room_tiers": "Private tour seasons need single, double, and triple room prices.",
    "catalog.trip.incomplete_group_room_tiers": "Group tour seasons need single, double, and triple room prices.",
    "catalog.trip.missing_hotels": "Select at least one hotel.",
    "catalog.trip.missing_hero_image": "Upload 1 thumbnail/hero image.",
    "catalog.trip.insufficient_gallery_images": `Upload at least ${REQUIRED_GALLERY_IMAGES} gallery images.`,
    "catalog.trip.missing_slug": "SEO slug is required.",
    "catalog.trip.archived": "Archived trips cannot be published.",
  };

  return Object.entries(blockerLabels).reduce(
    (text, [code, label]) => text.replaceAll(code, label),
    message
  );
}

function flattenApiErrors(value: any, path = ""): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    return [`${path ? `${humanFieldName(path)}: ` : ""}${humanBackendMessage(value)}`];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenApiErrors(item, path));
  }
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, nested]) => {
      const nextPath = path ? `${path}.${key}` : key;
      return flattenApiErrors(nested, nextPath);
    });
  }
  return [`${path ? `${humanFieldName(path)}: ` : ""}${String(value)}`];
}

function errorMessage(error: any): string {
  const data = error?.response?.data;
  const messages = flattenApiErrors(data);

  if (messages.length) return messages.join("\n");
  return error?.message || "Could not save trip.";
}

export function CreateTrip({ tripId, onDirtyChange, onSavingChange }: { tripId?: string; onDirtyChange?: (isDirty: boolean) => void; onSavingChange?: (isSaving: boolean) => void }) {
  const router = useRouter();
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
  const [savedTripId, setSavedTripId] = useState<string | number | undefined>(tripId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const methods = useForm<CreateTripValues>({
    resolver: zodResolver(createTripSchema),
    reValidateMode: "onSubmit",
    defaultValues: EMPTY_VALUES,
  });

  const { handleSubmit, formState: { isDirty } } = methods;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(isSaving);
  }, [isSaving, onSavingChange]);

  useEffect(() => {
    if (!tripId) return;

    let ignore = false;
    getCatalogTripDetail(tripId)
      .then((trip) => {
        if (!ignore) methods.reset(mapTripToFormValues(trip));
      })
      .catch((error) => {
        if (!ignore) setSaveError(errorMessage(error));
      });

    return () => {
      ignore = true;
    };
  }, [methods, tripId]);

  const onSubmit = async (data: CreateTripValues, meta: { intent: WizardSubmitIntent }) => {
    setIsSaving(true);
    setSaveError("");

    try {
      const clientValidationErrors = validateMediaBeforeSave(data, meta.intent);
      if (clientValidationErrors.length) {
        throw new Error(clientValidationErrors.join("\n"));
      }

      const payload = await buildPayload(data, meta.intent, !!(tripId || savedTripId));
      const response = tripId
        ? await updateCatalogTrip(tripId, payload)
        : await createCatalogTrip(payload);
      const nextTripId = tripId || response?.id || response?.data?.id;
      setSavedTripId(nextTripId);

      if (nextTripId && isFile(data.brochureFile)) {
        await updateTripBrochure(nextTripId, data.brochureFile);
      }

      if (!tripId && meta.intent === "publish" && nextTripId) {
        await publishCatalogTrip(nextTripId);
      }
    } catch (error: any) {
      const errStr = JSON.stringify(error?.response?.data || error?.message || "");
      if (
        errStr.includes("uniq_trip_availability_window") ||
        errStr.includes("duplicate key value violates unique constraint") ||
        errStr.includes("duplicate_availability_slot")
      ) {
        const slots = methods.getValues("datesAvailability.dates") || [];
        let matchedIndex = -1;
        // Prioritize a matching slot without an existing id (i.e. the one just added), searching from last to first
        for (let i = slots.length - 1; i >= 0; i--) {
          const s = slots[i];
          const range = s?.dateRange || "";
          if (range && !(s as any).id) {
            const parsed = parseDateRange(range);
            if (parsed.start_date && errStr.includes(parsed.start_date)) {
              matchedIndex = i;
              break;
            }
          }
        }
        // If not found, find the latest matching slot index from end of list
        if (matchedIndex === -1) {
          for (let i = slots.length - 1; i >= 0; i--) {
            const s = slots[i];
            const range = s?.dateRange || "";
            if (range) {
              const parsed = parseDateRange(range);
              if (parsed.start_date && errStr.includes(parsed.start_date)) {
                matchedIndex = i;
                break;
              }
            }
          }
        }
        // Fallback to the last slot if nothing matched specifically
        if (matchedIndex === -1 && slots.length > 0) {
          matchedIndex = slots.length - 1;
        }

        if (matchedIndex >= 0) {
          methods.setError(`datesAvailability.dates.${matchedIndex}.dateRange` as any, {
            type: "manual",
            message: "This date range has already been added.",
          });
        }
      }
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick,
  } = useWizard<CreateTripValues>({
    steps: STEPS,
    methods,
    onSubmit,
    onFinished: () => setIsPublishedModalOpen(true),
    isEdit: !!tripId,
  });

  const successCopy = useMemo(() => {
    if (tripId) {
      return {
        title: "Trip Updated Successfully",
        message: "All changes have been saved and are now reflected across the system.",
      };
    }

    return {
      title: "Trip Published Successfully",
      message: "Your trip package has been published and is now available for bookings and customer inquiries.",
    };
  }, [tripId]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OverviewStep />;
      case 1:
        return <InclusionsStep />;
      case 2:
        return <PricingStep />;
      case 3:
        return <ItineraryStep />;
      case 4:
        return <DatesAvailabilityStep />;
      case 5:
        return <HotelsStep />;
      case 6:
        return <WizardMediaStep />;
      case 7:
        return <SEOStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id="create-trip-form"
        className={styles.page}
        onSubmit={handleSubmit((data) => onSubmit(data, { intent: "save" }).then(() => setIsPublishedModalOpen(true)))}
      >
        <WizardLayout
          steps={STEPS}
          currentStep={currentStep}
          isEdit={!!tripId}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
          publishLabel="Publish Trip"
        >
          {renderStep()}
        </WizardLayout>
      </form>

      {isPublishedModalOpen && (
        <SuccessModal
          title={successCopy.title}
          message={successCopy.message}
          primaryButtonText="View Trip"
          buttonText="Back to Catalog"
          hideSecondaryButton={!tripId}
          onPrimaryClick={() => {
            setIsPublishedModalOpen(false);
            if (savedTripId) {
              window.location.href = `/dashboard/catalog/trips/${savedTripId}`;
            } else {
              router.push("/dashboard/catalog/trips?created=true");
            }
          }}
          onClose={() => {
            setIsPublishedModalOpen(false);
            if (tripId) {
              router.push("/dashboard/catalog/trips");
            }
          }}
        />
      )}
    </FormProvider>
  );
}

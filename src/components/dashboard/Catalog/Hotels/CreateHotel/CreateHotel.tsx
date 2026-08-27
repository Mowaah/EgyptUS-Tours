"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHotelSchema, type CreateHotelValues } from "./CreateHotelSchema";
import { OverviewStep } from "./Steps/Overview/OverviewStep";
import { RoomsStep } from "./Steps/Rooms/RoomsStep";
import { WizardMediaStep } from "@/components/dashboard/shared";
import { SEOStep } from "./Steps/SEO/SEOStep";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { WizardLayout } from "@/components/dashboard/shared";
import { useWizard, WizardStepConfig, WizardSubmitIntent } from "@/hooks/useWizard";
import { createCatalogHotel, updateCatalogHotel, publishCatalogHotel, archiveCatalogHotel, unpublishCatalogHotel } from "@/services/admin/adminCatalogHotelsService";
import { useCatalogHotelDetail, useCatalogHotelLocations } from "@/hooks/useCatalogHotels";
import { fileToBase64 } from "@/utils/imageUtils";
import styles from "./CreateHotel.module.scss";

const STEPS: WizardStepConfig[] = [
  { label: "Overview", iconSrc: "/images/dashboard/catalog/trips/overview.svg", fieldsToValidate: ["hotelName", "totalRooms", "subtitle", "cityLocation", "starRating", "facilities", "description", "secondDescription"] },
  { label: "Rooms", iconSrc: "/images/dashboard/catalog/hotels/basic.svg", fieldsToValidate: ["rooms"] },
  { label: "Media", iconSrc: "/images/dashboard/catalog/trips/media.svg", fieldsToValidate: ["photos"] },
  { label: "SEO", iconSrc: "/images/dashboard/catalog/trips/seo.svg", fieldsToValidate: ["metaTitle", "metaDescription", "metaKeywords", "slug"] },
];

function isFile(value: any): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function fileToDataUrl(file: File, maxWidth = 1920, quality = 0.85): Promise<string> {
  return fileToBase64(file, maxWidth, quality);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function padPhotos(rows: any[]): any[] {
  const result = [...rows];
  const MIN_PHOTOS = 6;
  while (result.length < MIN_PHOTOS) {
    result.push({ file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } });
  }
  return result;
}

function cleanNumber(value: any): string | undefined {
  if (value === null || value === undefined) return undefined;
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  return cleaned || undefined;
}

const EMPTY_VALUES: CreateHotelValues = {
  hotelName: { en: "", it: "", es: "" },
  totalRooms: "",
  subtitle: { en: "", it: "", es: "" },
  cityLocation: "",
  address: "",
  starRating: "",
  description: { en: "", it: "", es: "" },
  secondDescription: { en: "", it: "", es: "" },
  facilities: { en: [], it: [], es: [] },
  rooms: [{
    category: "",
    type: "",
    view: "",
    pricePerNight: "",
    pricePerNightEgp: "",
    description: { en: "", it: "", es: "" },
    facilities: [],
    photos: []
  }],
  photos: [
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }, // index 0 = hero/banner
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }, // index 1 = gallery 1
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }, // index 2 = gallery 2
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }, // index 3 = gallery 3
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }, // index 4 = gallery 4
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }, // index 5 = gallery 5
  ],
  metaTitle: { en: "", it: "", es: "" },
  metaDescription: { en: "", it: "", es: "" },
  metaKeywords: { en: "", it: "", es: "" },
  slug: { en: "", it: "", es: "" }
};

function mapHotelToFormValues(hotel: any): CreateHotelValues {
  const tEn = hotel?.translations?.en || {};
  const tIt = hotel?.translations?.it || {};
  const tEs = hotel?.translations?.es || {};
  
  const heroMedia = hotel?.media_items?.find((media: any) => media?.kind === "hero") || { image_url: hotel?.hero_image_url };
  const galleryMedia = hotel?.media_items?.filter((media: any) => media?.kind === "gallery") || [];
  const photoRows = [heroMedia, ...galleryMedia]
    .filter((m: any) => m && (m.image_url || m.file))
    .map((media: any) => {
      const mediaTranslations = media?.translations?.en || {};
      return {
        id: media?.id,
        kind: media?.kind || "gallery",
        file: media?.image_url,
        title: { en: tEn.title || media?.caption || "", it: media?.translations?.it?.title || "", es: media?.translations?.es?.title || "" },
        alt: { en: tEn.alt || "", it: media?.translations?.it?.alt || "", es: media?.translations?.es?.alt || "" },
      };
    });

  const rooms = (hotel?.rooms || []).map((room: any) => {
    return {
      id: room.id,
      category: room.category_label || "",
      type: room.type_label || "",
      view: room.view_label || "",
      pricePerNight: room.price_per_night_egp || room.price_per_night || "",
      pricePerNightEgp: room.price_per_night_egp || room.price_per_night || "",
      description: {
        en: room.translations?.en?.description || room.description || "",
        it: room.translations?.it?.description || "",
        es: room.translations?.es?.description || "",
      },
      facilities: room.features || [],
      photos: (room.images || room.photos || []).map((img: any) => ({
        id: img.id,
        file: img.image_url || img.image || img.file || img,
      }))
    };
  });

  return {
    hotelName: { en: tEn.name || hotel?.name || "", it: tIt.name || "", es: tEs.name || "" },
    totalRooms: hotel?.total_rooms ? String(hotel.total_rooms) : "",
    subtitle: { en: tEn.subtitle || hotel?.subtitle || "", it: tIt.subtitle || "", es: tEs.subtitle || "" },
    cityLocation: hotel?.location?.id ? String(hotel.location.id) : (hotel?.location_text || ""),
    address: hotel?.address || "",
    starRating: hotel?.stars ? String(hotel.stars) : "",
    description: { en: tEn.description || hotel?.description || "", it: tIt.description || "", es: tEs.description || "" },
    secondDescription: { en: tEn.second_description || hotel?.second_description || "", it: tIt.second_description || "", es: tEs.second_description || "" },
    facilities: {
      en: Array.isArray(tEn.facilities) ? tEn.facilities : Array.isArray(hotel?.facilities) ? hotel?.facilities : [],
      it: Array.isArray(tIt.facilities) ? tIt.facilities : [],
      es: Array.isArray(tEs.facilities) ? tEs.facilities : [],
    },
    rooms,
    photos: padPhotos(photoRows),
    metaTitle: { en: tEn.meta_title || "", it: tIt.meta_title || "", es: tEs.meta_title || "" },
    metaDescription: { en: tEn.meta_description || "", it: tIt.meta_description || "", es: tEs.meta_description || "" },
    metaKeywords: { 
      en: (tEn.meta_keywords || []).join(", "),
      it: (tIt.meta_keywords || []).join(", "),
      es: (tEs.meta_keywords || []).join(", ")
    },
    slug: { en: tEn.slug || hotel?.slug || "", it: tIt.slug || "", es: tEs.slug || "" }
  };
}

function validateBeforePublish(data: CreateHotelValues, intent: WizardSubmitIntent): string[] {
  const errors: string[] = [];
  
  if (intent === "publish") {
    const photos = data.photos || [];
    const hasHero = !!((photos[0] as any)?.file || (photos[0] as any)?.id);
    const galleryCount = photos.slice(1).filter((photo: any) => !!(photo?.file || photo?.id)).length;

    if (!hasHero) {
      errors.push("Media: upload 1 thumbnail/hero image before publishing.");
    }
    if (galleryCount < 5) {
      errors.push("Media: upload at least 5 gallery images before publishing.");
    }
    
    if (!data.rooms || data.rooms.length === 0) {
      errors.push("Rooms: add at least one room before publishing.");
    } else {
      const hasPricedRoom = data.rooms.some(r => parseFloat(String(r.pricePerNightEgp || r.pricePerNight || 0)) > 0);
      if (!hasPricedRoom) {
        errors.push("Rooms: at least one room must have an £ price before publishing.");
      }
    }
  }

  return errors;
}

export function CreateHotel({ hotelId, onDirtyChange, onSavingChange }: { hotelId?: string; onDirtyChange?: (isDirty: boolean) => void; onSavingChange?: (isSaving: boolean) => void }) {
  const router = useRouter();
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
  const [savedHotelId, setSavedHotelId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const { hotel, loading: hotelLoading } = useCatalogHotelDetail(hotelId || "");
  const { locations } = useCatalogHotelLocations();

  const methods = useForm<CreateHotelValues>({
    resolver: zodResolver(createHotelSchema) as any,
    defaultValues: EMPTY_VALUES,
  });

  const { handleSubmit, formState: { isDirty }, reset } = methods;

  useEffect(() => {
    if (hotelId && hotel) {
      reset(mapHotelToFormValues(hotel));
    }
  }, [hotelId, hotel, reset]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(isSaving);
  }, [isSaving, onSavingChange]);

  const onSubmit = async (data: CreateHotelValues, options?: { intent?: WizardSubmitIntent }) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const isCreate = !hotelId && !savedHotelId;
      const targetId = hotelId || savedHotelId;
      const intent = options?.intent || "save";

      const validationErrors = validateBeforePublish(data, intent);
      if (validationErrors.length > 0) {
        setSaveError(validationErrors.join(" "));
        throw new Error("Validation failed before publish");
      }

      const userSlug = data.slug?.en ? slugify(data.slug.en) : "";
      const baseSlug = slugify(data.hotelName?.en || "") || "hotel";
      const generatedSlug = userSlug || (isCreate ? `${baseSlug}-${Math.random().toString(36).substring(2, 6)}` : baseSlug);

      // Convert photos array to backend media_items format
      const photos = await Promise.all(
        (data.photos || []).map(async (photo: any, index: number) => {
          if (!photo?.file && !photo?.id) return null;
          let imageBase64: string | undefined = undefined;
          if (isFile(photo.file)) {
            imageBase64 = await fileToDataUrl(photo.file);
          } else if (typeof photo.file === "string" && photo.file.startsWith("data:")) {
            imageBase64 = photo.file;
          }
          return {
            id: photo.id ? parseInt(String(photo.id), 10) : undefined,
            kind: index === 0 ? "hero" : "gallery",
            image: imageBase64,
            translations: {
              en: { title: photo.title?.en || "", alt: photo.alt?.en || "" },
              it: { title: photo.title?.it || "", alt: photo.alt?.it || "" },
              es: { title: photo.title?.es || "", alt: photo.alt?.es || "" },
            },
            order: index,
          };
        })
      );
      const mediaItems = photos.filter((item): item is NonNullable<typeof item> => Boolean(item && (item.image || item.id)));

      const roomsPayload = await Promise.all(
        (data.rooms || []).map(async (r: any) => {
          const roomPhotos = await Promise.all(
            (r.photos || []).map(async (photo: any, idx: number) => {
              const isFileObj = isFile(photo);
              if (!isFileObj && !photo?.file && !photo?.id) return null;
              
              let imageBase64: string | undefined = undefined;
              const actualFile = isFileObj ? photo : photo.file;
              
              if (isFile(actualFile)) {
                imageBase64 = await fileToDataUrl(actualFile);
              } else if (typeof actualFile === "string" && actualFile.startsWith("data:")) {
                imageBase64 = actualFile;
              }
              
              return {
                id: isFileObj ? undefined : (photo.id ? parseInt(String(photo.id), 10) : undefined),
                image: imageBase64,
                order: idx,
              };
            })
          );
          const validImages = roomPhotos.filter((item): item is NonNullable<typeof item> => Boolean(item && (item.image || item.id)));

          const roomPriceEgp = cleanNumber(r.pricePerNightEgp) || cleanNumber(r.pricePerNight);

          return {
            id: r.id,
            category_label: r.category,
            type_label: r.type,
            view_label: r.view,
            price_per_night: roomPriceEgp ? parseFloat(roomPriceEgp) : undefined,
            price_per_night_egp: roomPriceEgp ? parseFloat(roomPriceEgp) : undefined,
            description: r.description?.en || "", // Fallback
            features: r.facilities,
            images: validImages,
            translations: {
              en: { description: r.description?.en || "" },
              it: { description: r.description?.it || "" },
              es: { description: r.description?.es || "" },
            },
          };
        })
      );

      const selectedLocation = locations.find((l: any) => String(l.id) === String(data.cityLocation));
      const selectedLocationName = selectedLocation?.name || undefined;

      // Map payload
      const payload: any = {
        translations: {
          en: {
            name: data.hotelName?.en || "",
            subtitle: data.subtitle?.en || "",
            description: data.description?.en || "",
            second_description: data.secondDescription?.en || "",
            location_text: selectedLocationName,
            meta_title: data.metaTitle?.en || "",
            meta_description: data.metaDescription?.en || "",
            meta_keywords: data.metaKeywords?.en ? data.metaKeywords.en.split(",").map(k => k.trim()).filter(Boolean) : [],
            slug: generatedSlug,
            address: data.address || "",
            facilities: data.facilities.en || [],
          },
          it: {
            name: data.hotelName?.it || "",
            subtitle: data.subtitle?.it || "",
            description: data.description?.it || "",
            second_description: data.secondDescription?.it || "",
            location_text: selectedLocationName,
            meta_title: data.metaTitle?.it || "",
            meta_description: data.metaDescription?.it || "",
            meta_keywords: data.metaKeywords?.it ? data.metaKeywords.it.split(",").map(k => k.trim()).filter(Boolean) : [],
            slug: data.slug?.it || "",
            facilities: data.facilities.it || [],
          },
          es: {
            name: data.hotelName?.es || "",
            subtitle: data.subtitle?.es || "",
            description: data.description?.es || "",
            second_description: data.secondDescription?.es || "",
            location_text: selectedLocationName,
            meta_title: data.metaTitle?.es || "",
            meta_description: data.metaDescription?.es || "",
            meta_keywords: data.metaKeywords?.es ? data.metaKeywords.es.split(",").map(k => k.trim()).filter(Boolean) : [],
            slug: data.slug?.es || "",
            facilities: data.facilities.es || [],
          }
        },
        location_id: data.cityLocation ? parseInt(data.cityLocation, 10) : undefined,
        stars: data.starRating ? parseFloat(cleanNumber(data.starRating) || "0") : undefined,
        total_rooms: data.totalRooms ? parseInt(cleanNumber(data.totalRooms) || "0") : undefined,
        facilities: data.facilities.en || [],
        replace_rooms: true,
        replace_media_items: true,
        media_items: mediaItems,
        rooms: roomsPayload,
      };

      let currentHotelId = targetId;
      if (isCreate) {
        const res = await createCatalogHotel(payload);
        currentHotelId = res.id;
        setSavedHotelId(currentHotelId as string);
      } else {
        await updateCatalogHotel(currentHotelId as string, payload);
      }

      if (intent === "publish") {
        await publishCatalogHotel(currentHotelId as string);
        setIsPublishedModalOpen(true);
      } else if (isCreate && intent === "save") {
        router.push(`/dashboard/catalog/hotels/${currentHotelId}/edit`);
      } else if (intent === "save") {
        setIsPublishedModalOpen(true);
      }

    } catch (err: any) {
      console.error("Save hotel failed:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save hotel.";
      setSaveError(msg);
      throw err; // Re-throw for useWizard to catch if needed
    } finally {
      setIsSaving(false);
    }
  };

const getErrorStepIndex = (errors: any) => {
  if (errors.hotelName || errors.cityLocation || errors.starRating || errors.totalRooms || errors.description || errors.facilities) return 0;
  if (errors.rooms) return 1;
  if (errors.photos) return 2;
  if (errors.metaTitle || errors.metaDescription || errors.metaKeywords || errors.slug) return 3;
  return -1;
};

  const {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick,
    setCurrentStep,
  } = useWizard<CreateHotelValues>({
    steps: STEPS,
    methods,
    onSubmit,
    onFinished: () => setIsPublishedModalOpen(true), // Only fallback if submit doesn't trigger it
    isEdit: !!hotelId,
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <OverviewStep />;
      case 1: return <RoomsStep />;
      case 2: return <WizardMediaStep />;
      case 3: return <SEOStep />;
      default: return null;
    }
  };

  if (hotelId && hotelLoading) {
    return <div className={styles.saveNotice}>Loading hotel data...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form
        id="create-hotel-form"
        className={styles.page}
        onSubmit={handleSubmit(
          (data) => onSubmit(data, { intent: "save" }).then(() => setIsPublishedModalOpen(true)),
          (errors) => {
            const errorStepIndex = getErrorStepIndex(errors);
            if (errorStepIndex !== -1 && errorStepIndex !== currentStep) {
              setCurrentStep(errorStepIndex);
            }
          }
        )}
      >
        <WizardLayout
          steps={STEPS}
          currentStep={currentStep}
          isEdit={!!hotelId}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
          publishLabel="Publish Hotel"
        >
          {renderStep()}
        </WizardLayout>
      </form>

      {isPublishedModalOpen && (
        <SuccessModal
          title={hotelId ? "Hotel Updated Successfully" : "Hotel Published Successfully"}
          message={hotelId ? "All changes have been saved and are now reflected across the system." : "Your hotel has been published and is now available for bookings and customer inquiries."}
          primaryButtonText="View Hotel"
          buttonText="Back to Catalog"
          hideSecondaryButton={!hotelId}
          onPrimaryClick={() => {
            setIsPublishedModalOpen(false);
            if (savedHotelId || hotelId) {
              window.location.href = `/dashboard/catalog/hotels/${savedHotelId || hotelId}`;
            } else {
              router.push("/dashboard/catalog/hotels?created=true");
            }
          }}
          onClose={() => {
            setIsPublishedModalOpen(false);
            if (hotelId || savedHotelId) {
              router.push("/dashboard/catalog/hotels");
            }
          }}
        />
      )}
    </FormProvider>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleSchema, type CreateVehicleValues } from "./CreateVehicleSchema";
import { IconStepper } from "@/components/shared";
import { OverviewStep } from "./Steps/Overview/OverviewStep";
import { PricingStep } from "./Steps/Pricing/PricingStep";
import { WizardMediaStep } from "@/components/dashboard/shared";
import { SEOStep } from "./Steps/SEO/SEOStep";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { WizardLayout } from "@/components/dashboard/shared";
import { useWizard, WizardStepConfig, WizardSubmitIntent } from "@/hooks/useWizard";
import { createCatalogVehicle, updateCatalogVehicle, publishCatalogVehicle } from "@/services/admin/adminCatalogVehiclesService";
import { useVehicleCategories, useCatalogVehicleDetail } from "@/hooks/useCatalogVehicles";
import { fileToBase64 } from "@/utils/imageUtils";
import styles from "./CreateVehicle.module.scss";

const STEPS: WizardStepConfig[] = [
  { label: "Overview", iconSrc: "/images/dashboard/catalog/trips/overview.svg", fieldsToValidate: ["vehicleName", "model", "category", "passengerCapacity"] },
  { label: "Pricing", iconSrc: "/images/dashboard/catalog/trips/pricing.svg", fieldsToValidate: ["basePrice", "pricePerKm"] },
  { label: "Media", iconSrc: "/images/dashboard/catalog/trips/media.svg", fieldsToValidate: ["photos"] },
  { label: "SEO", iconSrc: "/images/dashboard/catalog/trips/seo.svg", fieldsToValidate: ["seoTitle", "seoDescription", "seoKeywords", "seoSlug"] },
];

const EMPTY_VALUES: CreateVehicleValues = {
  vehicleName: { en: "", it: "", es: "" },
  model: "",
  category: "",
  duration: "",
  passengerCapacity: "",
  luggageCapacity: "",
  starRating: "",
  features: { en: [], it: [], es: [] },
  description: { en: "", it: "", es: "" },
  basePrice: "",
  pricePerKm: "",
  additionalServices: [],
  photos: [
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }, // hero
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }, // gallery
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } },
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } },
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } },
    { file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } },
  ],
  metaTitle: { en: "", it: "", es: "" },
  metaDescription: { en: "", it: "", es: "" },
  metaKeywords: { en: "", it: "", es: "" },
  slug: { en: "", it: "", es: "" },
};

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
  return fileToBase64(file);
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

function parseDurationHours(durationStr?: string): { duration_hours_min: number | null; duration_hours_max: number | null } {
  if (!durationStr) return { duration_hours_min: null, duration_hours_max: null };
  const lower = durationStr.trim().toLowerCase();
  if (lower.includes("full day") || lower === "24") {
    return { duration_hours_min: 24, duration_hours_max: 24 };
  }
  const matchRange = durationStr.match(/(\d+)\s*-\s*(\d+)/);
  if (matchRange) {
    return {
      duration_hours_min: parseInt(matchRange[1], 10),
      duration_hours_max: parseInt(matchRange[2], 10),
    };
  }
  const matchSingle = durationStr.match(/(\d+)/);
  if (matchSingle) {
    const hours = parseInt(matchSingle[1], 10);
    return {
      duration_hours_min: hours,
      duration_hours_max: hours,
    };
  }
  return { duration_hours_min: null, duration_hours_max: null };
}

function formatDurationHours(minHours?: number | null, maxHours?: number | null): string {
  if (!minHours && !maxHours) return "";
  if (minHours === 24 || maxHours === 24) return "Full Day";
  if (minHours && maxHours && minHours !== maxHours) return `${minHours}-${maxHours} Hours`;
  const hours = minHours || maxHours;
  if (!hours) return "";
  return hours === 1 ? "1 Hour" : `${hours} Hours`;
}

async function buildPayload(data: CreateVehicleValues, intent: WizardSubmitIntent, isEdit: boolean = false, categories: any[]) {
  const categoryId = categories.find(c => c.name === data.category || String(c.id) === data.category)?.id;
  
  const photos: any[] = [];
  for (let index = 0; index < (data.photos || []).length; index++) {
    const photo = data.photos[index];
    if (!photo?.file && !photo?.id) continue;
    
    const translations = {
      en: { title: photo.title?.en || "", alt: photo.alt?.en || "" },
      it: { title: photo.title?.it || "", alt: photo.alt?.it || "" },
      es: { title: photo.title?.es || "", alt: photo.alt?.es || "" },
    };

    if (index === 0) {
      photos.push({
        id: photo.id,
        kind: "hero",
        image: isFile(photo.file) ? await fileToDataUrl(photo.file) : undefined,
        translations,
        order: 0,
      });
      photos.push({
        id: photo.thumbnailId,
        kind: "thumbnail",
        image: isFile(photo.file) ? await fileToDataUrl(photo.file) : undefined,
        translations,
        order: 0,
      });
    } else {
      photos.push({
        id: photo.id,
        kind: "gallery",
        image: isFile(photo.file) ? await fileToDataUrl(photo.file) : undefined,
        translations,
        order: index,
      });
    }
  }

  const { duration_hours_min, duration_hours_max } = parseDurationHours(data.duration);
  const userSlugEn = data.slug?.en ? slugify(data.slug.en) : "";
  const baseSlugEn = slugify(data.vehicleName?.en || "vehicle");
  const slugEn = userSlugEn || (isEdit ? baseSlugEn : `${baseSlugEn}-${Math.random().toString(36).substring(2, 6)}`);

  return {
    translations: {
      en: {
        name: asText(data.vehicleName?.en),
        description: asText(data.description?.en),
        features: (data.features?.en || []).filter(Boolean),
        meta_title: asText(data.metaTitle?.en),
        meta_description: asText(data.metaDescription?.en),
        meta_keywords: asText(data.metaKeywords?.en).split(",").map(k => k.trim()).filter(Boolean),
        slug: slugEn,
      },
      it: {
        name: asText(data.vehicleName?.it),
        description: asText(data.description?.it),
        features: (data.features?.it || []).filter(Boolean),
        meta_title: asText(data.metaTitle?.it),
        meta_description: asText(data.metaDescription?.it),
        meta_keywords: asText(data.metaKeywords?.it).split(",").map(k => k.trim()).filter(Boolean),
        slug: asText(data.slug?.it),
      },
      es: {
        name: asText(data.vehicleName?.es),
        description: asText(data.description?.es),
        features: (data.features?.es || []).filter(Boolean),
        meta_title: asText(data.metaTitle?.es),
        meta_description: asText(data.metaDescription?.es),
        meta_keywords: asText(data.metaKeywords?.es).split(",").map(k => k.trim()).filter(Boolean),
        slug: asText(data.slug?.es),
      },
    },
    category_id: categoryId,
    model_year: intValue(data.model) || null,
    duration_hours_min,
    duration_hours_max,
    passengers: intValue(data.passengerCapacity) || 1,
    luggage_capacity: intValue(data.luggageCapacity) || 0,
    rating_avg: data.starRating ? parseFloat(data.starRating) : null,
    additional_service_ids: data.additionalServices?.map(id => parseInt(id, 10)) || [],
    currency_code: "£",
    price_amount: money(data.basePrice) || null,
    price_per_km: money(data.pricePerKm) || null,
    media_items: photos.filter(Boolean),
    replace_media_items: true,
    force_draft: intent !== "publish" && !isEdit,
  };
}

function mapVehicleToFormValues(vehicle: any): CreateVehicleValues {
  const tEn = vehicle?.translations?.en || {};
  const tIt = vehicle?.translations?.it || {};
  const tEs = vehicle?.translations?.es || {};
  const media = vehicle?.media_items || [];
  
  const photos: any[] = Array(6).fill(null).map(() => ({ file: undefined, title: { en: "", it: "", es: "" }, alt: { en: "", it: "", es: "" } }));
  media.forEach((item: any) => {
    const pEn = item.translations?.en || {};
    const pIt = item.translations?.it || {};
    const pEs = item.translations?.es || {};

    if (item.kind === "thumbnail") {
      photos[0].thumbnailId = item.id;
      if (!photos[0].file) photos[0].file = item.image_url;
    } else if (item.kind === "hero") {
      photos[0].id = item.id;
      if (!photos[0].file) photos[0].file = item.image_url;
      photos[0].title = { en: pEn.title || "", it: pIt.title || "", es: pEs.title || "" };
      photos[0].alt = { en: pEn.alt || "", it: pIt.alt || "", es: pEs.alt || "" };
    } else {
      const emptyIdx = photos.findIndex((p, i) => i > 0 && !p.id && !p.file);
      if (emptyIdx !== -1) {
        photos[emptyIdx] = { 
          id: item.id, 
          file: item.image_url, 
          title: { en: pEn.title || "", it: pIt.title || "", es: pEs.title || "" },
          alt: { en: pEn.alt || "", it: pIt.alt || "", es: pEs.alt || "" },
        };
      }
    }
  });

  return {
    vehicleName: { en: asText(tEn.name || vehicle.name), it: asText(tIt.name), es: asText(tEs.name) },
    model: asText(vehicle.model_year),
    category: asText(vehicle.category?.name),
    duration: formatDurationHours(vehicle.duration_hours_min, vehicle.duration_hours_max),
    passengerCapacity: asText(vehicle.passengers),
    luggageCapacity: asText(vehicle.luggage_capacity),
    starRating: vehicle.rating_avg ? String(vehicle.rating_avg) : "",
    features: {
      en: tEn.features || [],
      it: tIt.features || [],
      es: tEs.features || [],
    },
    description: { en: asText(tEn.description || vehicle.description), it: asText(tIt.description), es: asText(tEs.description) },
    basePrice: asText(vehicle.price_amount),
    pricePerKm: asText(vehicle.price_per_km),
    additionalServices: (vehicle.additional_services || []).map((s: any) => String(s.id || s)),
    photos,
    metaTitle: { en: asText(tEn.meta_title), it: asText(tIt.meta_title), es: asText(tEs.meta_title) },
    metaDescription: { en: asText(tEn.meta_description), it: asText(tIt.meta_description), es: asText(tEs.meta_description) },
    metaKeywords: { 
      en: (tEn.meta_keywords || []).join(", "),
      it: (tIt.meta_keywords || []).join(", "),
      es: (tEs.meta_keywords || []).join(", ")
    },
    slug: { en: asText(tEn.slug || vehicle.slug), it: asText(tIt.slug), es: asText(tEs.slug) },
  };
}

export function CreateVehicle({ vehicleId, onDirtyChange, onSavingChange }: { vehicleId?: string; onDirtyChange?: (isDirty: boolean) => void; onSavingChange?: (isSaving: boolean) => void }) {
  const router = useRouter();
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
  const [savedVehicleId, setSavedVehicleId] = useState<string | number | undefined>(vehicleId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const { data: vehicleData, loading: vehicleLoading } = useCatalogVehicleDetail(vehicleId);
  const { categories } = useVehicleCategories(); // Re-use the hook

  const methods = useForm<CreateVehicleValues>({
    resolver: zodResolver(createVehicleSchema) as any,
    defaultValues: EMPTY_VALUES,
  });

  const { handleSubmit, formState: { isDirty }, reset, watch, setValue } = methods;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSavingChange?.(isSaving);
  }, [isSaving, onSavingChange]);

  const metaTitle = watch("metaTitle");
  const slug = watch("slug");

  useEffect(() => {
    if (metaTitle && metaTitle.en && !slug?.en) {
      setValue("slug.en", slugify(metaTitle.en));
    }
  }, [metaTitle, slug?.en, setValue]);

  useEffect(() => {
    if (vehicleData) {
      reset(mapVehicleToFormValues(vehicleData));
    }
  }, [vehicleData, reset]);

  const onSubmit = async (data: CreateVehicleValues, meta: { intent: WizardSubmitIntent }) => {
    try {
      setIsSaving(true);
      setSaveError("");
      const payload = await buildPayload(data, meta.intent, !!(vehicleId || savedVehicleId), categories);
      
      let res;
      if (vehicleId || savedVehicleId) {
        res = await updateCatalogVehicle(vehicleId || savedVehicleId as any, payload);
      } else {
        res = await createCatalogVehicle(payload);
        setSavedVehicleId(res?.data?.id || res?.id);
      }

      const nextVehicleId = vehicleId || savedVehicleId || res?.data?.id || res?.id;
      if (meta.intent === "publish" && nextVehicleId) {
        await publishCatalogVehicle(nextVehicleId);
        setIsPublishedModalOpen(true);
      } else if (meta.intent === "save" && (vehicleId || savedVehicleId)) {
        setIsPublishedModalOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || "Failed to save vehicle");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

const getErrorStepIndex = (errors: any) => {
  if (errors.vehicleName || errors.category || errors.make || errors.model || errors.year || errors.description || errors.passengerCapacity || errors.luggageCapacity || errors.doors || errors.transmission || errors.features || errors.cancellationPolicy) return 0;
  if (errors.basePrice || errors.pricePerKm || errors.additionalServices) return 1;
  if (errors.photos) return 2;
  if (errors.metaTitle || errors.metaDescription || errors.metaKeywords || errors.slug) return 3;
  return -1;
};

  const { currentStep, handleNext, handlePrevious, handleStepClick, setCurrentStep } = useWizard<CreateVehicleValues>({
    steps: STEPS,
    methods,
    onSubmit,
    onFinished: () => setIsPublishedModalOpen(true),
    isEdit: !!(vehicleId || savedVehicleId),
  });

  if (vehicleLoading) {
    return <div style={{ padding: "24px" }}>Loading vehicle data...</div>;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <OverviewStep />;
      case 1: return <PricingStep />;
      case 2: return <WizardMediaStep />;
      case 3: return <SEOStep />;
      default: return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id="create-vehicle-form"
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
          isEdit={!!(vehicleId || savedVehicleId)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
          publishLabel="Publish Vehicle"
        >
          {renderStep()}
        </WizardLayout>
      </form>

      {isPublishedModalOpen && (
        <SuccessModal
          title={vehicleId ? "Vehicle Updated Successfully" : "Vehicle Published Successfully"}
          message={vehicleId ? "All changes have been saved and are now reflected across the system." : "Your vehicle has been published and is now available for bookings."}
          primaryButtonText="View Vehicle"
          buttonText="Back to Catalog"
          hideSecondaryButton={!vehicleId}
          onPrimaryClick={() => {
            setIsPublishedModalOpen(false);
            const target = vehicleId || savedVehicleId
              ? `/dashboard/catalog/transportation/${vehicleId || savedVehicleId}/overview`
              : "/dashboard/catalog/transportation?created=true";
            window.location.href = target;
          }}
          onClose={() => {
            setIsPublishedModalOpen(false);
            if (vehicleId || savedVehicleId) {
              router.push("/dashboard/catalog/transportation");
            }
          }}
        />
      )}
    </FormProvider>
  );
}

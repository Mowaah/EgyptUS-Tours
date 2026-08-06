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
import { createCatalogVehicle, updateCatalogVehicle } from "@/services/admin/adminCatalogVehiclesService";
import { useVehicleCategories, useCatalogVehicleDetail } from "@/hooks/useCatalogVehicles";
import styles from "./CreateVehicle.module.scss";

const STEPS: WizardStepConfig[] = [
  { label: "Overview", iconSrc: "/images/dashboard/catalog/trips/overview.svg", fieldsToValidate: ["vehicleName", "model", "category", "passengerCapacity"] },
  { label: "Pricing", iconSrc: "/images/dashboard/catalog/trips/pricing.svg", fieldsToValidate: ["basePrice", "vat", "insurance", "pricePerKm"] },
  { label: "Media", iconSrc: "/images/dashboard/catalog/trips/media.svg", fieldsToValidate: ["photos"] },
  { label: "SEO", iconSrc: "/images/dashboard/catalog/trips/seo.svg", fieldsToValidate: ["seoTitle", "seoDescription", "seoKeywords", "seoSlug"] },
];

const EMPTY_VALUES: CreateVehicleValues = {
  vehicleName: "",
  model: "",
  category: "",
  duration: "",
  passengerCapacity: "",
  luggageCapacity: "",
  starRating: "",
  features: [],
  description: "",
  basePrice: "",
  vat: "",
  insurance: "",
  pricePerKm: "",
  additionalServices: [],
  photos: [
    { file: undefined, title: "", alt: "" }, // hero
    { file: undefined, title: "", alt: "" }, // gallery
    { file: undefined, title: "", alt: "" },
    { file: undefined, title: "", alt: "" },
    { file: undefined, title: "", alt: "" },
    { file: undefined, title: "", alt: "" },
  ],
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoSlug: "",
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

async function buildPayload(data: CreateVehicleValues, intent: WizardSubmitIntent, isEdit: boolean = false, categories: any[]) {
  const categoryId = categories.find(c => c.name === data.category || String(c.id) === data.category)?.id;
  
  const photos = await Promise.all(
    (data.photos || []).map(async (photo: any, index: number) => {
      if (!photo?.file && !photo?.id) return null;
      return {
        id: photo.id,
        kind: index === 0 ? "hero" : "gallery",
        image: isFile(photo.file) ? await fileToDataUrl(photo.file) : undefined,
        translations: {
          en: {
            title: asText(photo.title),
            alt: asText(photo.alt),
          },
        },
        order: index,
      };
    })
  );

  return {
    translations: {
      en: {
        name: asText(data.vehicleName),
        description: asText(data.description),
        features: (data.features || []).filter(Boolean),
        meta_title: asText(data.seoTitle),
        meta_description: asText(data.seoDescription),
        meta_keywords: asText(data.seoKeywords).split(",").map(k => k.trim()).filter(Boolean),
        slug: asText(data.seoSlug) || slugify(asText(data.vehicleName)),
      },
    },
    category_id: categoryId,
    model_year: intValue(data.model) || null,
    passengers: intValue(data.passengerCapacity) || 1,
    luggage_capacity: intValue(data.luggageCapacity) || 0,
    rating_avg: data.starRating ? parseFloat(data.starRating) : null,
    features: (data.features || []).filter(Boolean),
    currency_code: "USD",
    price_amount: money(data.basePrice) || null,
    vat_amount: money(data.vat) || null,
    insurance_fee: money(data.insurance) || null,
    price_per_km: money(data.pricePerKm) || null,
    media_items: photos.filter(Boolean),
    replace_media_items: true,
    force_draft: intent !== "publish" && !isEdit,
  };
}

function mapVehicleToFormValues(vehicle: any): CreateVehicleValues {
  const english = vehicle?.translations?.en || {};
  const media = vehicle?.media_items || [];
  
  const photos = Array(6).fill({ file: undefined, title: "", alt: "" });
  media.forEach((item: any) => {
    if (item.kind === "hero" && !photos[0].id) {
      photos[0] = { id: item.id, file: item.image_url, title: item.translations?.en?.title || "", alt: item.translations?.en?.alt || "" };
    } else {
      const emptyIdx = photos.findIndex((p, i) => i > 0 && !p.id && !p.file);
      if (emptyIdx !== -1) {
        photos[emptyIdx] = { id: item.id, file: item.image_url, title: item.translations?.en?.title || "", alt: item.translations?.en?.alt || "" };
      }
    }
  });

  return {
    vehicleName: asText(english.name || vehicle.name),
    model: asText(vehicle.model_year),
    category: asText(vehicle.category?.name),
    duration: "", // Ignored for now based on user feedback
    passengerCapacity: asText(vehicle.passengers),
    luggageCapacity: asText(vehicle.luggage_capacity),
    starRating: vehicle.rating_avg ? String(vehicle.rating_avg) : "",
    features: vehicle.features || [],
    description: asText(english.description || vehicle.description),
    basePrice: asText(vehicle.price_amount),
    vat: asText(vehicle.vat_amount),
    insurance: asText(vehicle.insurance_fee),
    pricePerKm: asText(vehicle.price_per_km),
    additionalServices: [], // Not implemented properly yet, ignoring for now
    photos,
    seoTitle: asText(english.meta_title),
    seoDescription: asText(english.meta_description),
    seoKeywords: (english.meta_keywords || []).join(", "),
    seoSlug: asText(english.slug || vehicle.slug),
  };
}

export function CreateVehicle({ vehicleId, onDirtyChange }: { vehicleId?: string; onDirtyChange?: (isDirty: boolean) => void }) {
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

  const { handleSubmit, formState: { isDirty }, reset } = methods;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

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
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || "Failed to save vehicle");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const { currentStep, handleNext, handlePrevious, handleStepClick } = useWizard<CreateVehicleValues>({
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
      <div className={styles.page}>
        <WizardLayout
          steps={STEPS}
          currentStep={currentStep}
          isEdit={!!(vehicleId || savedVehicleId)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
          publishLabel="Publish Vehicle"
          error={saveError}
          isSaving={isSaving}
        >
          {renderStep()}
        </WizardLayout>
      </div>

      {isPublishedModalOpen && (
        <SuccessModal
          title={vehicleId ? "Vehicle Updated Successfully" : "Vehicle Published Successfully"}
          message={vehicleId ? "All changes have been saved and are now reflected across the system." : "Your vehicle has been published and is now available for bookings."}
          primaryButtonText="View Vehicle"
          buttonText="Back to Catalog"
          hideSecondaryButton={!vehicleId}
          onPrimaryClick={() => {
            setIsPublishedModalOpen(false);
            router.push(vehicleId || savedVehicleId ? `/dashboard/catalog/transportation/${vehicleId || savedVehicleId}/overview` : "/dashboard/catalog/transportation?created=true");
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

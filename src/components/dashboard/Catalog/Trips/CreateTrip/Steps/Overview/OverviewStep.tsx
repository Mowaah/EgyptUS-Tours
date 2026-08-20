"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { FormSection, FormSpec, UploadDropzone } from "@/components/dashboard/FormFields";
import { getCategories } from "@/services/admin/adminCatalogCategoriesService";
import { getDestinations } from "@/services/admin/adminCatalogDestinationsService";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import styles from "../../CreateTrip.module.scss";
import { CreateTripValues } from "../../CreateTripSchema";

const durationOptions = [
  { label: "Select Duration", value: "", disabled: true },
  { label: "4 Days - 3 Nights", value: "4d-3n" },
  { label: "8 Days - 7 Nights", value: "8d-7n" },
  { label: "10 Days - 9 Nights", value: "10d-9n" },
];

const tourTypeOptions = [
  { label: "Select Tour Type", value: "", disabled: true },
  { label: "Private Tour", value: "private-tour" },
  { label: "Group Tour", value: "group-tour" },
];

type CatalogOptionRecord = {
  id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
  translations?: {
    en?: {
      name?: string;
      title?: string;
    };
  };
};

function asList(payload: unknown): CatalogOptionRecord[] {
  const value = payload as { results?: unknown; data?: unknown };
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(value.results)) return value.results as CatalogOptionRecord[];
  if (Array.isArray(value.data)) return value.data as CatalogOptionRecord[];
  const nested = value.data as { results?: unknown } | undefined;
  if (Array.isArray(nested?.results)) return nested.results as CatalogOptionRecord[];
  return [];
}

function optionLabel(item: CatalogOptionRecord): string {
  return item?.name || item?.title || item?.translations?.en?.name || item?.translations?.en?.title || "Untitled";
}

export function OverviewStep() {
  const [basicInfoLang, setBasicInfoLang] = useState<Language>("English");
  const [tripContentLang, setTripContentLang] = useState<Language>("English");
  const [categoryOptions, setCategoryOptions] = useState([{ label: "Select Category", value: "", disabled: true }]);
  const [destinationOptions, setDestinationOptions] = useState([{ label: "Select Destinations", value: "", disabled: true }]);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateTripValues>();

  useEffect(() => {
    let ignore = false;

    Promise.all([getCategories({ page_size: 100 }), getDestinations({ page_size: 100 })])
      .then(([categoriesPayload, destinationsPayload]) => {
        if (ignore) return;
        setCategoryOptions([
          { label: "Select Category", value: "", disabled: true },
          ...asList(categoriesPayload).map((category) => ({
            label: optionLabel(category),
            value: String(category.slug || category.id),
            disabled: false,
          })),
        ]);
        setDestinationOptions([
          { label: "Select Destinations", value: "", disabled: true },
          ...asList(destinationsPayload).map((destination) => ({
            label: optionLabel(destination),
            value: String(destination.slug || destination.id),
            disabled: false,
          })),
        ]);
      })
      .catch(() => {
        if (!ignore) {
          setCategoryOptions([{ label: "Select Category", value: "", disabled: true }]);
          setDestinationOptions([{ label: "Select Destinations", value: "", disabled: true }]);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const hasError = Boolean(errors.tripName || errors.category || errors.destinations || errors.duration || errors.tourTypes);

  React.useEffect(() => {
    if (hasError && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasError]);

  return (
    <div className={styles.columnsContainer} ref={containerRef}>
      {/* Left Column: Basic Information */}
      <div className={styles.leftColumn}>
        <FormSection title="Basic Information" iconSrc="/images/dashboard/catalog/trips/overview.svg">
          <FormSpec>
            <LanguageTabs active={basicInfoLang} onChange={setBasicInfoLang} variant="white" className={styles.tabsMargin} />
            
            <div className={styles.fieldRow}>
              <DashboardField 
                label="Trip Name" 
                placeholder="Enter trip name" 
                variant="modal"
                {...register(`tripName.${getLangKey(basicInfoLang)}` as const)} 
                error={errors.tripName?.[getLangKey(basicInfoLang)]?.message} 
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <DashboardField
                    control="select"
                    variant="modal"
                    label="Category"
                    options={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.category?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldRow}>
              <Controller
                name="destinations"
                control={control}
                render={({ field }) => (
                  <DashboardField
                    control="select"
                    variant="modal"
                    label="Destinations"
                    options={destinationOptions}
                    value={field.value}
                    onChange={field.onChange}
                    multiple
                    error={errors.destinations?.message}
                  />
                )}
              />
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <DashboardField
                    control="select"
                    variant="modal"
                    label="Duration"
                    options={durationOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.duration?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldRow}>
              <Controller
                name="tourTypes"
                control={control}
                render={({ field }) => (
                  <DashboardField
                    control="select"
                    variant="modal"
                    label="Tour"
                    options={tourTypeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    multiple
                    error={errors.tourTypes?.message}
                  />
                )}
              />
              <Controller
                name="starRating"
                control={control}
                render={({ field, fieldState }) => (
                  <DashboardField 
                    {...field}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val > 5) e.target.value = "5";
                      if (val < 0) e.target.value = "0";
                      field.onChange(e);
                    }}
                    label="Star Rating" 
                    placeholder="Enter rating (0 - 5)" 
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.uploadSection}>
              <label style={{ alignSelf: "flex-start", fontWeight: 700, color: "#0E2851", fontSize: "14px" }}>
                Brochure
              </label>
              <Controller
                name="brochureFile"
                control={control}
                render={({ field }) => (
                  <UploadDropzone 
                    onFileSelect={(file) => {
                      field.onChange(file);
                    }} 
                    value={field.value} 
                    accept="application/pdf"
                    title="Click to upload a PDF brochure or drag & drop"
                    subtitle="PDF up to 10MB"
                  />
                )}
              />
            </div>
          </FormSpec>
        </FormSection>
      </div>

      {/* Right Column: Trip Content */}
      <div className={styles.rightColumn}>
        <FormSection title="Trip Content" iconSrc="/images/dashboard/fields/publish-settings.svg">
          <FormSpec>
            <LanguageTabs active={tripContentLang} onChange={setTripContentLang} variant="white" className={styles.tabsMargin} />
            
            <DashboardField 
              control="textarea"
              variant="modal"
              label="Description (Long description)" 
              placeholder="Enter long description" 
              {...register(`description.${getLangKey(tripContentLang)}` as const)} 
              error={errors.description?.[getLangKey(tripContentLang)]?.message} 
            />

            <DashboardField 
              control="textarea"
              variant="modal"
              label="Cultural Value (Short description)" 
              placeholder="Enter short description" 
              {...register(`culturalValue.${getLangKey(tripContentLang)}` as const)} 
              error={errors.culturalValue?.[getLangKey(tripContentLang)]?.message} 
            />

            <DashboardField 
              control="textarea"
              variant="modal"
              label="Who is this trip for?" 
              placeholder="Enter target audience details" 
              {...register(`whoIsTripFor.${getLangKey(tripContentLang)}` as const)} 
              error={errors.whoIsTripFor?.[getLangKey(tripContentLang)]?.message} 
            />
          </FormSpec>
        </FormSection>
      </div>
    </div>
  );
}

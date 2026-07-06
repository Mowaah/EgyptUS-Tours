"use client";

import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { FormSection, FormSpec, UploadDropzone } from "@/components/dashboard/FormFields";
import styles from "../../CreateTrip.module.scss";
import { CreateTripValues } from "../../CreateTripSchema";

const categoryOptions = [
  { label: "Select Category", value: "", disabled: true },
  { label: "Multi Country Trips", value: "multi-country-trips" },
  { label: "Adventure Tours", value: "adventure-tours" },
  { label: "Family Tours", value: "family-tours" },
];

const destinationOptions = [
  { label: "Select Destinations", value: "", disabled: true },
  { label: "Cairo", value: "cairo" },
  { label: "Luxor & Aswan", value: "luxor-aswan" },
  { label: "Alexandria", value: "alexandria" },
];

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

export function OverviewStep() {
  const [basicInfoLang, setBasicInfoLang] = useState<Language>("English");
  const [tripContentLang, setTripContentLang] = useState<Language>("English");

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateTripValues>();

  return (
    <div className={styles.columnsContainer}>
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
                {...register("tripName")} 
                error={errors.tripName?.message} 
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
              {...register("description")} 
              error={errors.description?.message} 
            />

            <DashboardField 
              control="textarea"
              variant="modal"
              label="Cultural Value (Short description)" 
              placeholder="Enter short description" 
              {...register("culturalValue")} 
              error={errors.culturalValue?.message} 
            />

            <DashboardField 
              control="textarea"
              variant="modal"
              label="Who is this trip for?" 
              placeholder="Enter target audience details" 
              {...register("whoIsTripFor")} 
              error={errors.whoIsTripFor?.message} 
            />
          </FormSpec>
        </FormSection>
      </div>
    </div>
  );
}

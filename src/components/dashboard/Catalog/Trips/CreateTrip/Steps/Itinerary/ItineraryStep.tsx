"use client";

import { useState, useEffect } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import { UploadDropzone } from "@/components/dashboard/FormFields";
import { CreateTripValues } from "../../CreateTripSchema";
import styles from "./ItineraryStep.module.scss";

// ─── Day Card ────────────────────────────────────────────────────────────────

interface DayCardProps {
  index: number;
  onRemove: () => void;
}

function DayCard({ index, onRemove }: DayCardProps) {
  const { control, register } = useFormContext<CreateTripValues>();
  const [lang, setLang] = useState<Language>("English");

  const {
    fields: highlights,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: `itinerary.${index}.highlights` as never,
  });

  return (
    <div className={styles.dayCard}>
      {/* Day Header */}
      <div className={styles.dayHeader}>
        <div className={styles.dayHeaderLeft}>
          <div className={styles.dayIcon}>
            <Image
              src="/images/dashboard/catalog/trips/day.svg"
              alt=""
              width={20}
              height={20}
            />
          </div>
          <span className={styles.dayTitle}>Day {index + 1}</span>
        </div>
        <button
          type="button"
          className={styles.deleteDayButton}
          onClick={onRemove}
          aria-label={`Delete Day ${index + 1}`}
        >
          <Image src="/images/dashboard/delete.svg" alt="Delete" width={24} height={24} />
        </button>
      </div>

      {/* Language Tabs */}
      <LanguageTabs active={lang} onChange={setLang} />

      {/* Inner Card */}
      <div className={styles.dayInnerCard}>
        {/* Day Title */}
        <DashboardField
          key={`dayTitle-${lang}`}
          variant="modal"
          label="Day Title"
          placeholder="Enter day title"
          {...register(`itinerary.${index}.title.${getLangKey(lang)}` as never)}
        />

        {/* Short Subtitle */}
        <DashboardField
          key={`daySubtitle-${lang}`}
          variant="modal"
          label="Short Subtitle"
          placeholder="Enter short subtitle"
          {...register(`itinerary.${index}.subtitle.${getLangKey(lang)}` as never)}
        />

        {/* Day Description */}
        <DashboardField
          key={`dayDescription-${lang}`}
          variant="modal"
          control="textarea"
          label="Day Description"
          placeholder="Describe the day's activities..."
          rows={4}
          {...register(`itinerary.${index}.description.${getLangKey(lang)}` as never)}
        />

        {/* Highlights */}
        <div className={styles.highlightsSection}>
          <span className={styles.highlightsLabel}>Highlights</span>

          <div className={styles.highlightsList}>
            {highlights.map((field, hIdx) => (
              <div key={field.id} className={styles.highlightRow}>
                <DashboardField
                  key={`highlight-${field.id}-${lang}`}
                  variant="modal"
                  label={null}
                  placeholder="Enter highlight"
                  {...register(`itinerary.${index}.highlights.${hIdx}.${getLangKey(lang)}` as never)}
                  endAdornment={
                    <button
                      type="button"
                      className={styles.deleteHighlightButton}
                      onClick={() => removeHighlight(hIdx)}
                      aria-label="Delete highlight"
                    >
                      <Image src="/images/dashboard/delete.svg" alt="Delete" width={18} height={18} />
                    </button>
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.addHighlightButton}
            onClick={() => appendHighlight({ en: "", it: "", es: "" } as any)}
          >
            + Add Highlight
          </button>
        </div>

        {/* Image Upload */}
        <Controller
          name={`itinerary.${index}.image` as never}
          control={control}
          render={({ field }) => (
            <div className={styles.imageUploadSection}>
              <span className={styles.imageLabel}>Image ( 663 x 528 )</span>
              <UploadDropzone
                value={field.value as File | undefined}
                onFileSelect={field.onChange}
                accept="image/png, image/jpeg, image/webp"
                title="Click to upload an image or drag & drop"
                subtitle="PNG, JPG, WEBP up to 5MB"
                maxSizeBytes={5 * 1024 * 1024}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}

// ─── Itinerary Step ──────────────────────────────────────────────────────────

export function ItineraryStep() {
  const { control } = useFormContext<CreateTripValues>();

  const { fields: days, append: appendDay, remove: removeDay } = useFieldArray({
    control,
    name: "itinerary" as never,
  });

  const handleAddDay = () => {
    appendDay({
      title: { en: "", it: "", es: "" },
      subtitle: { en: "", it: "", es: "" },
      description: { en: "", it: "", es: "" },
      highlights: [],
      image: undefined,
    } as never);
  };

  // Days are now initialized in CreateTrip.tsx defaultValues

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Image
              src="/images/dashboard/catalog/trips/itinerary.svg"
              alt="Itinerary"
              width={20}
              height={20}
            />
          </div>
          <h2 className={styles.title}>Day-by-Day Itinerary</h2>
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddDay}
          aria-label="Add day"
        >
          <Image
            src="/images/dashboard/navbar/add-circle.svg"
            alt="Add"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* Days Grid */}
      <div className={styles.daysGrid}>
        {days.map((field, index) => (
          <DayCard
            key={field.id}
            index={index}
            onRemove={() => removeDay(index)}
          />
        ))}
      </div>
    </div>
  );
}

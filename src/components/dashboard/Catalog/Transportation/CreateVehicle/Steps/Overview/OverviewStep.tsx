import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection, FormSpec } from "@/components/dashboard/FormFields";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import { useVehicleCategories } from "@/hooks/useCatalogVehicles";
import { CreateVehicleValues } from "../../CreateVehicleSchema";
import dashboardStyles from "../../CreateVehicle.module.scss";
import styles from "./OverviewStep.module.scss";

export function OverviewStep() {
  const [basicLang, setBasicLang] = useState<Language>("English");
  const [contentLang, setContentLang] = useState<Language>("English");
  const [featuresLang, setFeaturesLang] = useState<Language>("English");
  const [featureInput, setFeatureInput] = useState("");

  const { categories } = useVehicleCategories();

  const { register, watch, setValue, control, formState: { errors } } = useFormContext<CreateVehicleValues>();
  const allFeatures = watch("features") || { en: [], it: [], es: [] };
  const currentLangKey = getLangKey(featuresLang) as "en" | "it" | "es";
  const features = allFeatures[currentLangKey] || [];

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setValue(`features.${currentLangKey}`, [...features, trimmed]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (tag: string) => {
    setValue(`features.${currentLangKey}`, features.filter((t) => t !== tag));
  };

  return (
    <div className={dashboardStyles.columnsContainer}>
      <div className={dashboardStyles.leftColumn}>
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          iconSrc="/images/dashboard/catalog/hotels/basic.svg"
          className={styles.card}
        >
          <FormSpec>
            <LanguageTabs active={basicLang} onChange={setBasicLang} variant="white" />

            <div className={styles.inputRow}>
              <DashboardField
                key={`vehicleName-${basicLang}`}
                label="Vehicle Name"
                placeholder="Mercedes S-Class"
                error={errors.vehicleName?.[getLangKey(basicLang)]?.message}
                {...register(`vehicleName.${getLangKey(basicLang)}` as const)}
              />
              <Controller
                name="model"
                control={control}
                render={({ field, fieldState }) => (
                  <DashboardField
                    {...field}
                    label="Model"
                    placeholder="Select model"
                    control="select"
                    options={[
                      { label: "2022", value: "2022" },
                      { label: "2023", value: "2023" },
                      { label: "2024", value: "2024" },
                      { label: "2025", value: "2025" },
                    ]}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.inputRow}>
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                  <DashboardField
                    {...field}
                    label="Category"
                    placeholder="Select category"
                    control="select"
                    options={
                      categories.length > 0 
                        ? categories.map((c: any) => ({ label: c.name, value: c.name }))
                        : [
                            { label: "Sedan", value: "Sedan" },
                            { label: "Van", value: "Van" },
                            { label: "Bus", value: "Bus" },
                            { label: "SUV", value: "SUV" },
                          ]
                    }
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <DashboardField
                    {...field}
                    label="Duration"
                    placeholder="Select duration"
                    control="select"
                    options={[
                      { label: "1 Hour", value: "1 Hour" },
                      { label: "2 Hours", value: "2 Hours" },
                      { label: "3 Hours", value: "3 Hours" },
                      { label: "4 Hours", value: "4 Hours" },
                      { label: "5 Hours", value: "5 Hours" },
                      { label: "6 Hours", value: "6 Hours" },
                      { label: "7 Hours", value: "7 Hours" },
                      { label: "8 Hours", value: "8 Hours" },
                      { label: "9 Hours", value: "9 Hours" },
                      { label: "10 Hours", value: "10 Hours" },
                      { label: "11 Hours", value: "11 Hours" },
                      { label: "12 Hours", value: "12 Hours" },
                      { label: "Full Day", value: "Full Day" },
                    ]}
                  />
                )}
              />
            </div>

            <div className={styles.inputRow}>
              <Controller
                name="passengerCapacity"
                control={control}
                render={({ field, fieldState }) => (
                  <DashboardField
                    {...field}
                    label="Passenger Capacity"
                    placeholder="Select capacity"
                    control="select"
                    options={[
                      { label: "1", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "6", value: "6" },
                      { label: "8", value: "8" },
                      { label: "12", value: "12" },
                    ]}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="luggageCapacity"
                control={control}
                render={({ field }) => (
                  <DashboardField
                    {...field}
                    label="Luggage Capacity"
                    placeholder="Select capacity"
                    control="select"
                    options={[
                      { label: "1", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "5", value: "5" },
                    ]}
                  />
                )}
              />
            </div>

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
          </FormSpec>
        </FormSection>

        {/* Features & Amenities */}
        <FormSection
          title="Features & Amenities"
          iconSrc="/images/dashboard/catalog/hotels/facilities.svg"
          className={styles.card}
        >
          <FormSpec>
            <LanguageTabs active={featuresLang} onChange={setFeaturesLang} variant="white" />

            <div className={styles.inputGroup}>
              <div className={styles.facilityInputWrapper}>
                <input
                  type="text"
                  placeholder="Enter feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={handleAddFeature}
                  disabled={!featureInput.trim()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {features.length > 0 && (
                <div className={styles.facilitiesTags}>
                  {features.map((feat) => (
                    <div key={feat} className={styles.facilityTag}>
                      <span>{feat}</span>
                      <button type="button" onClick={() => handleRemoveFeature(feat)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.17 14.83L14.83 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.83 14.83L9.17 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSpec>
        </FormSection>
      </div>

      {/* Right column: Vehicle Content */}
      <div className={dashboardStyles.rightColumn}>
        <FormSection
          title="Vehicle Content"
          iconSrc="/images/dashboard/catalog/hotels/hotel_content.svg"
          className={styles.card}
        >
          <FormSpec>
            <LanguageTabs active={contentLang} onChange={setContentLang} variant="white" />
            <DashboardField
              key={`description-${contentLang}`}
              label="Overview"
              control="textarea"
              placeholder="Enter vehicle overview..."
              error={errors.description?.[getLangKey(contentLang)]?.message}
              {...register(`description.${getLangKey(contentLang)}` as const)}
            />
          </FormSpec>
        </FormSection>
      </div>
    </div>
  );
}

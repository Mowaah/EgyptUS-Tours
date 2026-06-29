"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import {
  FormSection,
  FormSpec,
  ToggleField,
} from "@/components/dashboard/FormFields";
import CustomDatePicker from "@/components/shared/CustomDatePicker/CustomDatePicker";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { createPromotionSchema, type CreatePromotionValues } from "./CreatePromotionSchema";
import styles from "./CreatePromotion.module.scss";

export function CreatePromotion({ promotionId }: { promotionId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromList = searchParams?.get("from") === "list";
  const [detailsLang, setDetailsLang] = useState<Language>("English");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePromotionValues>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      discountValue: 0,
      appliesToType: "trips",
      appliesToItems: [
        { id: "1", category: "", specificTrip: [] }
      ],
      isActive: false,
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (promotionId) {
      // Simulate API fetch for edit mode
      const timer = setTimeout(() => {
        reset({
          title: "Summer Special 20% Off",
          shortDescription: "A great deal for the summer season, available for a limited time.",
          discountValue: 20,
          appliesToType: "trips",
          appliesToItems: [
            { id: Date.now().toString(), category: "adventure", specificTrip: ["luxar_aswan", "cairo"] }
          ],
          isActive: true,
          startDate: "06/01/2026",
          endDate: "08/31/2026",
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [promotionId, reset]);

  const { fields: appliesToFields, append, remove } = useFieldArray({
    control,
    name: "appliesToItems",
  });

  const appliesToType = watch("appliesToType");
  const watchedItems = watch("appliesToItems");

  let categoryLabel = "Trip Category";
  let categoryPlaceholder = "Select Trip Category";
  let specificLabel = "Specific Trip";
  let specificPlaceholder = "Select Trip Category first...";
  let categoryOptions = [
    { label: "Honey Moon", value: "honeymoon" },
    { label: "Adventure", value: "adventure" },
  ];
  let specificOptions = [
    { label: "Luxar & Aswan 5 days", value: "luxar_aswan" },
    { label: "Cairo Pyramids", value: "cairo" },
    { label: "Sharm El Sheikh", value: "sharm" },
    { label: "Hurghada Resort", value: "hurghada" },
    { label: "Alexandria Library", value: "alexandria" },
  ];

  if (appliesToType === "hotels") {
    categoryLabel = "Hotel Destination";
    categoryPlaceholder = "Select Hotel Destination";
    specificLabel = "Specific Hotel";
    specificPlaceholder = "Select hotel Category first...";
    categoryOptions = [
      { label: "Cairo", value: "cairo" },
      { label: "Luxor", value: "luxor" },
    ];
    specificOptions = [
      { label: "Marriott Mena House", value: "marriott" },
      { label: "Steigenberger Nile Palace", value: "steigenberger" },
      { label: "Sofitel Winter Palace", value: "sofitel" },
      { label: "Four Seasons", value: "fourseasons" },
      { label: "Hilton Ramses", value: "hilton" },
    ];
  } else if (appliesToType === "transportation") {
    categoryLabel = "Vehicle Type";
    categoryPlaceholder = "Select Vehicle Type";
    specificLabel = "Specific Vehicle";
    specificPlaceholder = "Select Vehicle Type first...";
    categoryOptions = [
      { label: "Bus", value: "bus" },
      { label: "Minivan", value: "minivan" },
    ];
    specificOptions = [
      { label: "Toyota Hiace", value: "hiace" },
      { label: "Mercedes Sprinter", value: "sprinter" },
      { label: "Hyundai H1", value: "h1" },
      { label: "Coaster Bus", value: "coaster" },
      { label: "Luxury Sedan", value: "sedan" },
    ];
  }

  const onSubmit = (data: CreatePromotionValues) => {
    console.log("Form Payload:", data);
    if (promotionId) {
      if (fromList) {
        router.push(`/dashboard/marketing/promotions?editSaved=true`);
      } else {
        router.push(`/dashboard/marketing/promotions/${promotionId}?editSaved=true`);
      }
    } else {
      setShowSuccessModal(true);
    }
  };

  return (
    <form id="create-promotion-form" className={styles.page} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.mainColumn}>
        <FormSection title="Offer Details" iconSrc="/images/dashboard/promotions/offer-details.svg">
          <FormSpec>
            <LanguageTabs active={detailsLang} onChange={setDetailsLang} className={styles.whiteTabs} />
            <DashboardField 
              label="Title" 
              placeholder="e.g. Summer Special 20% Off ..." 
              {...register("title")} 
              error={errors.title?.message} 
            />
            <DashboardField
              control="textarea"
              label="Short Description"
              placeholder="Brief summary shown in listings (max 300 chars)..."
              maxLength={300}
              {...register("shortDescription")}
              error={errors.shortDescription?.message}
            />
          </FormSpec>
        </FormSection>

        <FormSection title="Discount Configuration" iconSrc="/images/dashboard/promotions/discount.svg">
          <FormSpec>
            <DashboardField 
              type="number"
              label="Discount Value" 
              placeholder="% e.g. 20" 
              {...register("discountValue", { valueAsNumber: true })} 
              error={errors.discountValue?.message} 
            />
          </FormSpec>
        </FormSection>

        <div className={styles.appliesToContainer}>
          <div className={styles.appliesToHeader}>
            <div className={styles.appliesToTitleRow}>
              <div style={{ width: 40, height: 40, background: "#F8F9FB", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image src="/images/dashboard/promotions/applies.svg" alt="icon" width={20} height={20} />
              </div>
              <h3>Applies To</h3>
            </div>
            <button type="button" className={styles.addBtn} onClick={() => append({ id: Date.now().toString(), category: "", specificTrip: [] })}>
              <Image src="/images/plus.svg" alt="Add" width={20} height={20} style={{ filter: "brightness(0) invert(1)" }} />
            </button>
          </div>

          <div className={styles.pillsRow}>
            {[
              { id: "trips", label: "Trips & Packages" },
              { id: "hotels", label: "Hotels" },
              { id: "transportation", label: "Transportation" },
            ].map((type) => (
              <div 
                key={type.id} 
                className={`${styles.pill} ${appliesToType === type.id ? styles.active : ""}`}
                onClick={() => {
                  if (appliesToType !== type.id) {
                    setValue("appliesToType", type.id as any);
                    setValue("appliesToItems", [{ id: Date.now().toString(), category: "", specificTrip: [] }]);
                  }
                }}
              >
                <div className={`${styles.radioCircle} ${appliesToType === type.id ? styles.activeCircle : ""}`}>
                  {appliesToType === type.id && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.33333 2.5L3.75 7.08333L1.66667 5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span>{type.label}</span>
              </div>
            ))}
          </div>

          {appliesToFields.length > 0 && (
            <div className={styles.dynamicList}>
              {appliesToFields.map((field, index) => (
                <div key={field.id} className={styles.dynamicRow}>
                  <div className={styles.dynamicFields}>
                    <Controller
                      name={`appliesToItems.${index}.category`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <DashboardField
                          control="select"
                          label={categoryLabel}
                          options={[
                            { label: categoryPlaceholder, value: "", disabled: true },
                            ...categoryOptions,
                          ]}
                          value={value}
                          onChange={onChange}
                          error={errors.appliesToItems?.[index]?.category?.message}
                        />
                      )}
                    />
                    <Controller
                      name={`appliesToItems.${index}.specificTrip`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <DashboardField
                          control="select"
                          label={specificLabel}
                          multiple={true}
                          disabled={!watchedItems?.[index]?.category}
                          options={[
                            { label: specificPlaceholder, value: "", disabled: true },
                            ...specificOptions,
                          ]}
                          value={value}
                          onChange={onChange}
                          error={errors.appliesToItems?.[index]?.specificTrip?.message}
                        />
                      )}
                    />
                  </div>
                  <button type="button" className={styles.removeBtn} onClick={() => remove(index)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.sideColumn}>
        <FormSection title="Status & Rules" iconSrc="/images/dashboard/promotions/status.svg">
          <div className={styles.fieldColumn}>
            <FormSpec>
              <Controller
                name="isActive"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <ToggleField
                    label="Active"
                    description="Activate this promotion if you'd like it to go live"
                    checked={value}
                    onChange={onChange}
                    ref={ref}
                  />
                )}
              />
            </FormSpec>
          </div>
        </FormSection>

        <FormSection title="Validity Period" iconSrc="/images/dashboard/promotions/validity.svg">
          <FormSpec>
            <div className={styles.fieldRow}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    variant="custom"
                    value={field.value || ""}
                    onChange={field.onChange}
                    renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                      <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                        <DashboardField
                          label="Start Date"
                          value={displayTxt || field.value || ""}
                          readOnly
                          placeholder="mm/dd/yyyy"
                          error={errors.startDate?.message}
                          endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden className={styles.iconOverlay} />}
                        />
                      </div>
                    )}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    variant="custom"
                    value={field.value || ""}
                    onChange={field.onChange}
                    renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                      <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                        <DashboardField
                          label="End Date"
                          value={displayTxt || field.value || ""}
                          readOnly
                          placeholder="mm/dd/yyyy"
                          error={errors.endDate?.message}
                          endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden className={styles.iconOverlay} />}
                        />
                      </div>
                    )}
                  />
                )}
              />
            </div>
          </FormSpec>
        </FormSection>
      </div>

      {showSuccessModal && (
        <SuccessModal
          title={promotionId ? "Edits Saved" : "Offer is Now Live"}
          message={promotionId ? "Your promotional offer edits have been successfully saved." : "Your offer has been successfully activated and is now available to customers."}
          hideSecondaryButton
          primaryButtonText="View Details"
          onPrimaryClick={() => router.push('/dashboard/marketing/promotions')}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </form>
  );
}

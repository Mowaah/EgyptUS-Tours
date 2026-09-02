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
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import { createPromotionSchema, type CreatePromotionValues } from "./CreatePromotionSchema";
import { getAdminPromotionById, createAdminPromotion, updateAdminPromotion } from "@/services/admin/adminMarketingService";
import { apiClient } from "@/lib/api";
import styles from "./CreatePromotion.module.scss";

export function CreatePromotion({ promotionId, onDirtyChange, onSubmittingChange }: { promotionId?: string, onDirtyChange?: (isDirty: boolean) => void, onSubmittingChange?: (isSubmitting: boolean) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromList = searchParams?.get("from") === "list";
  const [detailsLang, setDetailsLang] = useState<Language>("English");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftEvent, setDraftEvent] = useState<any>(null);
  const [itemsCache, setItemsCache] = useState<{ [key: string]: any[] }>({
    trips: [{ id: Date.now().toString(), category: "", specificTrip: [] }],
    hotels: [{ id: Date.now().toString(), category: "", specificTrip: [] }],
    transportation: [{ id: Date.now().toString(), category: "", specificTrip: [] }],
  });

  const [tripsData, setTripsData] = useState<any[]>([]);
  const [hotelsData, setHotelsData] = useState<any[]>([]);
  const [transportData, setTransportData] = useState<any[]>([]);

  const langMap: Record<Language, "en" | "it" | "es"> = {
    English: "en",
    Italian: "it",
    Spanish: "es",
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<CreatePromotionValues>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      translations: {
        en: { title: "", shortDescription: "" },
        it: { title: "", shortDescription: "" },
        es: { title: "", shortDescription: "" },
      },
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
    console.log("CreatePromotion Form isDirty:", isDirty, "dirtyFields:", dirtyFields);
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, dirtyFields, onDirtyChange]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [tripsRes, hotelsRes, transportRes] = await Promise.all([
          apiClient.get('/trips/?page_size=100'),
          apiClient.get('/hotels/?page_size=100'),
          apiClient.get('/vehicles/?page_size=100')
        ]);
        const tripsDataList = (tripsRes as any).results || (tripsRes as any).data?.results;
        const hotelsDataList = (hotelsRes as any).results || (hotelsRes as any).data?.results;
        const transportDataList = (transportRes as any).results || (transportRes as any).data?.results;

        if (tripsDataList) setTripsData(tripsDataList);
        if (hotelsDataList) setHotelsData(hotelsDataList);
        if (transportDataList) setTransportData(transportDataList);
      } catch (err) {
        console.error("Failed to fetch options data", err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (promotionId) {
      const fetchPromotion = async () => {
        try {
          const data = await getAdminPromotionById(promotionId);

          let formattedStartDate = "";
          let formattedEndDate = "";
          if (data.valid_from) {
            const dateObj = new Date(data.valid_from);
            // Needs MM/DD/YYYY
            formattedStartDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;
          }
          if (data.valid_to) {
            const dateObj = new Date(data.valid_to);
            formattedEndDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;
          }

          reset({
            translations: {
              en: {
                title: data.translations?.en?.title || data.title || "",
                shortDescription: data.translations?.en?.description || data.description || "",
              },
              it: {
                title: data.translations?.it?.title || "",
                shortDescription: data.translations?.it?.description || "",
              },
              es: {
                title: data.translations?.es?.title || "",
                shortDescription: data.translations?.es?.description || "",
              },
            },
            discountValue: Number(data.discount_value),
            appliesToType: data.applies_to === "trip" ? "trips" : data.applies_to === "hotel" ? "hotels" : "transportation",
            appliesToItems: Array.isArray(data.applies_to_rules) && data.applies_to_rules.length > 0
              ? data.applies_to_rules.map((rule: any, i: number) => ({
                id: String(i),
                category: rule.group_label || "",
                specificTrip: (rule.item_ids || []).map((id: number) => String(id)),
              }))
              : [{ id: Date.now().toString(), category: "", specificTrip: [] }],
            isActive: data.status === "active",
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          });

          // Pre-populate cache with initial loaded data
          const mappedType = data.applies_to === "trip" ? "trips" : data.applies_to === "hotel" ? "hotels" : "transportation";
          if (Array.isArray(data.applies_to_rules) && data.applies_to_rules.length > 0) {
            setItemsCache(prev => ({
              ...prev,
              [mappedType]: data.applies_to_rules.map((rule: any, i: number) => ({
                id: String(i),
                category: rule.group_label || "",
                specificTrip: (rule.item_ids || []).map((id: number) => String(id)),
              }))
            }));
          }
        } catch (error) {
          console.error("Failed to fetch promotion", error);
        }
      };
      fetchPromotion();
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
  let categoryOptions: { label: string, value: string }[] = [];

  const getSpecificOptions = (category: string) => {
    if (!category) return [];
    if (appliesToType === "trips") {
      return tripsData.filter(t => {
        const tags = t.tags?.map((tag: any) => tag.name) || [];
        return category === "Uncategorized" ? tags.length === 0 : tags.includes(category);
      }).map(t => ({ label: t.title, value: String(t.id) }));
    }
    if (appliesToType === "hotels") {
      return hotelsData.filter(h => (h.location_text || "Uncategorized") === category).map(h => ({ label: h.name, value: String(h.id) }));
    }
    if (appliesToType === "transportation") {
      return transportData.filter(t => (t.vehicle_type || t.category || "Uncategorized") === category).map(t => ({ label: t.name || t.title, value: String(t.id) }));
    }
    return [];
  };

  if (appliesToType === "trips") {
    const categories = new Set<string>();
    tripsData.forEach(t => {
      if (!t.tags || t.tags.length === 0) categories.add("Uncategorized");
      else t.tags.forEach((tag: any) => categories.add(tag.name));
    });
    categoryOptions = Array.from(categories).map(c => ({ label: String(c), value: String(c) }));
  } else if (appliesToType === "hotels") {
    categoryLabel = "Hotel Destination";
    categoryPlaceholder = "Select Hotel Destination";
    specificLabel = "Specific Hotel";
    specificPlaceholder = "Select hotel Category first...";
    const categories = Array.from(new Set(hotelsData.map(h => h.location_text || "Uncategorized"))).filter(Boolean);
    categoryOptions = categories.map(c => ({ label: String(c), value: String(c) }));
  } else if (appliesToType === "transportation") {
    categoryLabel = "Vehicle Type";
    categoryPlaceholder = "Select Vehicle Type";
    specificLabel = "Specific Vehicle";
    specificPlaceholder = "Select Vehicle Type first...";
    const categories = Array.from(new Set(transportData.map(t => t.vehicle_type || t.category || "Uncategorized"))).filter(Boolean);
    categoryOptions = categories.map(c => ({ label: String(c), value: String(c) }));
  }

  const onSubmit = async (data: CreatePromotionValues, isDraft: boolean = false) => {
    try {
      if (onSubmittingChange) onSubmittingChange(true);
      let formattedStartDate = null;
      if (data.startDate) {
        const d = new Date(data.startDate);
        if (!Number.isNaN(d.getTime())) formattedStartDate = d.toISOString().split('T')[0];
      }
      
      let formattedEndDate = null;
      if (data.endDate) {
        const d = new Date(data.endDate);
        if (!Number.isNaN(d.getTime())) formattedEndDate = d.toISOString().split('T')[0];
      }

      const payload = {
        status: isDraft ? "draft" : (data.isActive ? "active" : "inactive"),
        discount_value: data.discountValue,
        applies_to: data.appliesToType === "trips" ? "trip" : data.appliesToType === "hotels" ? "hotel" : "transport",
        valid_from: formattedStartDate,
        valid_to: formattedEndDate,
        translations: {
          en: {
            title: data.translations.en.title,
            description: data.translations.en.shortDescription,
          },
          it: {
            title: data.translations.it.title,
            description: data.translations.it.shortDescription,
          },
          es: {
            title: data.translations.es.title,
            description: data.translations.es.shortDescription,
          }
        },
        applies_to_rules: data.appliesToItems.map(item => ({
          group_label: item.category,
          item_ids: (item.specificTrip || []).map(id => Number(id))
        })),
      };

      if (promotionId) {
        await updateAdminPromotion(promotionId, payload);
        if (fromList) {
          router.push(`/dashboard/marketing/promotions?editSaved=true`);
        } else {
          router.push(`/dashboard/marketing/promotions/${promotionId}?editSaved=true`);
        }
      } else {
        await createAdminPromotion(payload);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Failed to save promotion", error);
    } finally {
      if (onSubmittingChange) onSubmittingChange(false);
    }
  };

  const onError = (formErrors: any) => {
    if (formErrors.translations) {
      if (formErrors.translations.en) setDetailsLang("English");
      else if (formErrors.translations.it) setDetailsLang("Italian");
      else if (formErrors.translations.es) setDetailsLang("Spanish");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement | undefined;
    const btnTextLower = (submitter?.innerText || submitter?.textContent || "").toLowerCase();

    const isSavingDraft = btnTextLower.includes("draft") || btnTextLower.includes("save draft") || btnTextLower.includes("save as draft");

    if (isSavingDraft) {
      const isEnValid = await trigger("translations.en.title");
      const isItValid = await trigger("translations.it.title");
      const isEsValid = await trigger("translations.es.title");

      if (isEnValid && isItValid && isEsValid) {
        setDraftEvent(e);
        setShowDraftModal(true);
      } else {
        const langToSet = !isEnValid ? "English" : !isItValid ? "Italian" : "Spanish";
        setDetailsLang(langToSet);
        
        setTimeout(() => {
          const inputName = `translations.${langToSet === "English" ? "en" : langToSet === "Italian" ? "it" : "es"}.title`;
          document.querySelector(`input[name="${inputName}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    } else {
      await handleSubmit((data) => onSubmit(data, false), onError)(e);
    }
  };

  const confirmSaveDraft = async () => {
    setShowDraftModal(false);
    const currentValues = getValues();
    await onSubmit(currentValues, true);
  };

  return (
    <form id="create-promotion-form" className={styles.page} onSubmit={handleFormSubmit}>
      <div className={styles.mainColumn}>
        <FormSection title="Offer Details" iconSrc="/images/dashboard/promotions/offer-details.svg">
          <FormSpec>
            <LanguageTabs active={detailsLang} onChange={setDetailsLang} className={styles.whiteTabs} />
            <React.Fragment key={detailsLang}>
              <DashboardField
                label="Title"
                placeholder="e.g. Summer Special 20% Off ..."
                {...register(`translations.${langMap[detailsLang]}.title` as const)}
                error={errors.translations?.[langMap[detailsLang]]?.title?.message}
              />
              <DashboardField
                control="textarea"
                label="Short Description"
                placeholder="Brief summary shown in listings (max 300 chars)..."
                maxLength={300}
                {...register(`translations.${langMap[detailsLang]}.shortDescription` as const)}
                error={errors.translations?.[langMap[detailsLang]]?.shortDescription?.message}
              />
            </React.Fragment>
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
                    setItemsCache(prev => ({ ...prev, [appliesToType]: watchedItems }));
                    setValue("appliesToType", type.id as any);
                    setValue("appliesToItems", itemsCache[type.id] || [{ id: Date.now().toString(), category: "", specificTrip: [] }]);
                  }
                }}
              >
                <div className={`${styles.radioCircle} ${appliesToType === type.id ? styles.activeCircle : ""}`}>
                  {appliesToType === type.id && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.33333 2.5L3.75 7.08333L1.66667 5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span>{type.label}</span>
              </div>
            ))}
          </div>

          {appliesToFields.length > 0 && (
            <div className={styles.dynamicList}>
              {appliesToFields.map((field, index) => {
                const currentCategory = watchedItems[index]?.category;
                const selectedCategories = watchedItems.map((item, i) => i !== index ? item.category : null).filter(Boolean);
                const availableCategories = categoryOptions.filter(opt => !selectedCategories.includes(opt.value));

                const currentTrips = watchedItems[index]?.specificTrip || [];
                const selectedTrips = watchedItems.flatMap((item, i) => i !== index ? (item.specificTrip || []) : []);
                const availableTrips = getSpecificOptions(currentCategory).filter(opt => !selectedTrips.includes(opt.value));

                return (
                  <div key={field.id} className={styles.dynamicRow}>
                    <div className={styles.dynamicFields}>
                      <Controller
                        name={`appliesToItems.${index}.category`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <DashboardField
                            control="select"
                            label={categoryLabel}
                            placeholder={categoryPlaceholder}
                            value={value}
                            onChange={(e: any) => {
                              onChange(e.target.value);
                              setValue(`appliesToItems.${index}.specificTrip`, []);
                            }}
                            options={[
                              { label: categoryPlaceholder, value: "", disabled: true },
                              ...availableCategories,
                            ]}
                          />
                        )}
                      />
                      <Controller
                        name={`appliesToItems.${index}.specificTrip`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <DashboardField
                            control="select"
                            multiple={true}
                            label={specificLabel}
                            value={value || []}
                            onChange={(e: any) => {
                              const newArr = e.target.value;
                              onChange(newArr);
                              setValue(`appliesToItems.${index}.specificTrip`, newArr, { shouldDirty: true, shouldValidate: true });
                            }}
                            options={[
                              { label: specificPlaceholder, value: "", disabled: true },
                              ...availableTrips,
                            ]}
                            error={errors.appliesToItems?.[index]?.specificTrip?.message}
                          />
                        )}
                      />
                    </div>
                    <button type="button" className={styles.removeBtn} onClick={() => remove(index)}>
                      <Image src="/images/dashboard/delete.svg" alt="Remove" width={24} height={24} />
                    </button>
                  </div>
                );
              })}
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

      <DashboardConfirmationModal
        open={showDraftModal}
        variant="activate"
        title="Save Promotion as Draft?"
        message="The Promotion will not be published and can be edited or published later."
        cancelLabel="Cancel"
        confirmLabel="Save as Draft"
        onClose={() => setShowDraftModal(false)}
        onConfirm={confirmSaveDraft}
      />
    </form>
  );
}

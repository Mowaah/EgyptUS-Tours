"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { DashboardFooter, LocalizedImageUploadSection } from "@/components/dashboard/shared";
import { FormSection } from "@/components/dashboard/FormFields";
import SEOSettingsSection from "@/components/dashboard/shared/SEOSettingsSection/SEOSettingsSection";
import { seoConfigurationSchema, type SEOConfigurationValues } from "./SEOConfigurationSchema";
import styles from "./SEOConfiguration.module.scss";
import { useAdminSeo } from "@/hooks/useAdminSeo";
import { fileToBase64, SeoConfigPayload } from "@/services/admin/adminSeoService";
import { getLangKey } from "@/components/dashboard/shared/i18n";

interface SEOConfigurationFormProps {
  pageKey: string;
  onSuccess: () => void;
}

export default function SEOConfigurationForm({ pageKey, onSuccess }: SEOConfigurationFormProps) {
  const { data, loading, updateConfig } = useAdminSeo(pageKey);
  const [imageLang, setImageLang] = useState<Language>("English");
  const [seoLang, setSeoLang] = useState<Language>("English");

  const supportsOgImage = ["home", "mice_events", "b2b"].includes(pageKey);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SEOConfigurationValues>({
    resolver: zodResolver(seoConfigurationSchema) as any,
    defaultValues: {},
  });

  // Default slug for each page key — used when backend has no slug saved yet
  const PAGE_KEY_TO_SLUG: Record<string, string> = {
    home: "",
    trips: "trips",
    hotels: "hotels",
    transportation: "transportation",
    mice_events: "events",
    b2b: "b2b-programs",
  };

  // Load existing data
  useEffect(() => {
    if (data) {
      const defaultSlug = PAGE_KEY_TO_SLUG[pageKey] ?? pageKey;

      const defaultValues: any = {
        metaTitle: {},
        metaDescription: {},
        metaKeywords: {},
        slug: {},
        imageTitle: {},
        imageAlt: {},
      };

      Object.entries(data.translations || {}).forEach(([locale, t]: [string, any]) => {
        defaultValues.metaTitle[locale] = t.meta_title || "";
        defaultValues.metaDescription[locale] = t.meta_description || "";
        defaultValues.metaKeywords[locale] = (t.meta_keywords || []).join(", ");
        // Fall back to the default slug if the backend hasn't stored one yet
        defaultValues.slug[locale] = t.slug || defaultSlug;
        if (supportsOgImage) {
          defaultValues.imageTitle[locale] = t.image_title || "";
          defaultValues.imageAlt[locale] = t.image_alt || "";
        }
      });

      if (data.og_image) {
        defaultValues.imageFile = data.og_image;
      }

      reset(defaultValues);
    }
  }, [data, reset, supportsOgImage]);

  const onSubmit = async (formData: SEOConfigurationValues) => {
    try {
      const payload: SeoConfigPayload = { translations: {} };

      const locales = ["en", "es", "it"];
      locales.forEach((locale) => {
        const title = (formData.metaTitle as any)?.[locale];
        const desc = (formData.metaDescription as any)?.[locale];
        const keywordsStr = (formData.metaKeywords as any)?.[locale];
        const slug = (formData.slug as any)?.[locale];

        let imgTitle, imgAlt;
        if (supportsOgImage) {
          imgTitle = (formData.imageTitle as any)?.[locale];
          imgAlt = (formData.imageAlt as any)?.[locale];
        }

        const keywordsArray = keywordsStr
          ? keywordsStr.split(",").map((k: string) => k.trim()).filter((k: string) => k)
          : [];

        // We must supply English translation, and others if they have data
        if (locale === "en" || title || desc || keywordsArray.length > 0 || slug || imgTitle || imgAlt) {
          (payload.translations as any)[locale] = {
            meta_title: title || "",
            meta_description: desc || "",
            meta_keywords: keywordsArray,
            slug: slug || "",
          };

          if (supportsOgImage) {
            (payload.translations as any)[locale].image_title = imgTitle || "";
            (payload.translations as any)[locale].image_alt = imgAlt || "";
          }
        }
      });

      if (supportsOgImage && formData.imageFile instanceof File) {
        payload.og_image = await fileToBase64(formData.imageFile);
      } else if (supportsOgImage && !formData.imageFile) {
        payload.og_image = null; // clear image
      }

      await updateConfig(payload);
      onSuccess();
    } catch (err) {
      console.error("Failed to save SEO configuration", err);
    }
  };

  const imageFile = watch("imageFile");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof imageFile === "string") {
      setPreviewUrl(imageFile);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  if (loading) {
    return <div className={styles.container}>Loading configuration...</div>;
  }

  const imageLangKey = getLangKey(imageLang);

  const onError = (formErrors: any) => {
    // Collect all languages that have errors
    const errorLangs = new Set<string>();

    const checkField = (field: any) => {
      if (!field) return;
      if (field.en) errorLangs.add("English");
      if (field.it) errorLangs.add("Italian");
      if (field.es) errorLangs.add("Spanish");
    };

    checkField(formErrors.metaTitle);
    checkField(formErrors.metaDescription);
    checkField(formErrors.metaKeywords);
    checkField(formErrors.slug);
    checkField(formErrors.imageTitle);
    checkField(formErrors.imageAlt);

    if (errorLangs.has("English")) {
      setSeoLang("English");
      setImageLang("English");
    } else if (errorLangs.has("Italian")) {
      setSeoLang("Italian");
      setImageLang("Italian");
    } else if (errorLangs.has("Spanish")) {
      setSeoLang("Spanish");
      setImageLang("Spanish");
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit, onError)}>
      <div className={styles.formContainer}>
        {supportsOgImage && (
          <div className={styles.column}>
            <LocalizedImageUploadSection
              title="Upload Image"
              iconSrc="/images/dashboard/fields/document-upload.svg"
              fileFieldName="imageFile"
              titleFieldNameBase="imageTitle"
              altFieldNameBase="imageAlt"
              titleLabel="Image Title"
              altLabel="Image Alt"
              titlePlaceholder="Image Title..."
              altPlaceholder="Comma-separated tags (e.g. egypt, travel, cairo)"
              lang={imageLang}
              setLang={setImageLang}
              control={control}
              register={register}
              errors={errors}
              registerPathFn={(langCode, fieldName) => `${fieldName}.${langCode}`}
            />

            {previewUrl && (
              <FormSection title="Preview" iconSrc="/images/dashboard/fields/eye.svg">
                <div className={styles.previewCard}>
                  <div className={styles.previewImageWrapper}>
                    <Image src={previewUrl as string} alt="Preview" fill className={styles.previewImage} />
                  </div>
                </div>
              </FormSection>
            )}
          </div>
        )}

        <div className={styles.column} style={{ width: supportsOgImage ? "auto" : "100%" }}>
          <SEOSettingsSection
            title="General SEO"
            seoLang={seoLang}
            setSeoLang={setSeoLang}
            register={register}
            control={control}
            errors={errors}
          />
        </div>
      </div>

      <DashboardFooter
        lastUpdateDate={data?.updated_at ? new Date(data.updated_at).toLocaleDateString() : ""}
        isSubmit={true}
        isSaveDisabled={!isDirty || isSubmitting}
      />
    </form>
  );
}

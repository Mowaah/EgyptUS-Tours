"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { DashboardFooter } from "@/components/dashboard/shared";;
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import { FormSection, FormSpec, UploadDropzone, KeywordsField } from "@/components/dashboard/FormFields";
import { seoConfigurationSchema, type SEOConfigurationValues } from "./SEOConfigurationSchema";
import styles from "./SEOConfiguration.module.scss";

const seoTabs = [
  { id: "home", label: "Home", iconSrc: "/images/dashboard/seo/home.svg" },
  { id: "trips", label: "Trips", iconSrc: "/images/dashboard/seo/trips.svg" },
  { id: "hotels", label: "Hotels", iconSrc: "/images/dashboard/seo/hotels.svg" },
  { id: "transportation", label: "Transportation", iconSrc: "/images/dashboard/seo/transportation.svg" },
  { id: "mice-events", label: "Mice & Events", iconSrc: "/images/dashboard/seo/mice.svg" },
  { id: "b2b", label: "B2B", iconSrc: "/images/dashboard/seo/b2b.svg" },
];

export default function SEOConfiguration() {
  const [activeTab, setActiveTab] = useState("home");
  const [imageLang, setImageLang] = useState<Language>("English");
  const [seoLang, setSeoLang] = useState<Language>("English");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SEOConfigurationValues>({
    resolver: zodResolver(seoConfigurationSchema),
    defaultValues: {},
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = (data: SEOConfigurationValues) => {
    console.log("Saved SEO Configuration:", activeTab, data);
    setShowSuccess(true);
  };

  const imageFile = watch("imageFile");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof imageFile === 'string') {
      setPreviewUrl(imageFile);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <DashboardStatusBanner 
        show={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        message="Your changes have been saved successfully." 
      />
      <div className={styles.tabsContainer}>
        <DashboardTabs
          tabs={seoTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="SEO Settings Categories"
        />
      </div>

      <div className={styles.formContainer}>
        {["home", "mice-events", "b2b"].includes(activeTab) && (
          <div className={styles.column}>
          <FormSection title="Upload Image" iconSrc="/images/dashboard/fields/document-upload.svg">
            <FormSpec>
              <Controller
                name="imageFile"
                control={control}
                render={({ field }) => (
                  <UploadDropzone onFileSelect={field.onChange} value={field.value || undefined} />
                )}
              />
              <LanguageTabs active={imageLang} onChange={setImageLang} className={styles.whiteTabs} />
              <div className={styles.fieldRow}>
                <DashboardField label="Image Title" placeholder="Image Title..." {...register("imageTitle")} error={errors.imageTitle?.message} />
                <DashboardField label="Image Alt" placeholder="Comma-separated tags (e.g. egypt, travel, cairo)" {...register("imageAlt")} error={errors.imageAlt?.message} />
              </div>
            </FormSpec>
          </FormSection>

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

        <div className={styles.column}>
          <FormSection title="General SEO" iconSrc="/images/dashboard/fields/seo-settings.svg">
            <FormSpec>
              <LanguageTabs active={seoLang} onChange={setSeoLang} className={styles.whiteTabs} />
              <DashboardField label="Meta Title" placeholder="Meta Title..." {...register("metaTitle")} error={errors.metaTitle?.message} />
              <DashboardField
                control="textarea"
                label="Meta Description"
                placeholder="SEO description (max 300 char..."
                maxLength={300}
                {...register("metaDescription")}
                error={errors.metaDescription?.message}
              />
              <Controller
                name="metaKeywords"
                control={control}
                render={({ field }) => (
                  <KeywordsField
                    label="Meta keywords"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.metaKeywords?.message}
                  />
                )}
              />
              <DashboardField label="Slug" placeholder="e.g. your-page-url-slug" {...register("slug")} error={errors.slug?.message} />
            </FormSpec>
          </FormSection>
        </div>
      </div>

      <DashboardFooter lastUpdateDate="42/6/206" isSubmit={true} />
    </form>
  );
}

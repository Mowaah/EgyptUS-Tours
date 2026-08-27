import React from "react";
import { UseFormRegister, Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { FormSection, FormSpec, KeywordsField } from "@/components/dashboard/FormFields";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import styles from "./SEOSettingsSection.module.scss";

interface SEOSettingsSectionProps<T extends FieldValues> {
  seoLang: Language;
  setSeoLang: (lang: Language) => void;
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  title?: string;
  pathPrefix?: string;
}

export default function SEOSettingsSection<T extends FieldValues>({
  seoLang,
  setSeoLang,
  register,
  control,
  errors,
  title = "SEO Settings",
  pathPrefix = "",
}: SEOSettingsSectionProps<T>) {
  const langKey = getLangKey(seoLang);
  
  const getPath = (field: string) => {
    if (pathPrefix) return `${pathPrefix}.${langKey}.${field}` as Path<T>;
    return `${field}.${langKey}` as Path<T>;
  };

  const getError = (field: string) => {
    if (pathPrefix) {
      const parts = pathPrefix.split('.');
      let err: any = errors;
      for (const p of parts) err = err?.[p];
      return err?.[langKey]?.[field]?.message;
    }
    return (errors as any)[field]?.[langKey]?.message;
  };

  return (
    <FormSection title={title} iconSrc="/images/dashboard/fields/seo-settings.svg">
      <FormSpec>
        <LanguageTabs active={seoLang} onChange={setSeoLang} className={styles.whiteTabs} />
        <DashboardField
          key={`metaTitle-${langKey}`}
          label="Meta Title"
          placeholder="Meta Title..."
          {...register(getPath("metaTitle"))}
          error={getError("metaTitle")}
        />
        <DashboardField
          key={`metaDescription-${langKey}`}
          control="textarea"
          label="Meta Description"
          placeholder="SEO description (max 300 char..."
          maxLength={300}
          {...register(getPath("metaDescription"))}
          error={getError("metaDescription")}
        />
        <Controller
          key={`metaKeywords-${langKey}`}
          name={getPath("metaKeywords")}
          control={control}
          render={({ field }) => (
            <KeywordsField
              label="Meta keywords"
              value={field.value as string}
              onChange={field.onChange}
              error={getError("metaKeywords")}
            />
          )}
        />
        <DashboardField
          key={`slug-${langKey}`}
          label="Slug"
          placeholder="e.g. your-page-url-slug"
          {...register(getPath("slug"))}
          error={getError("slug")}
        />
      </FormSpec>
    </FormSection>
  );
}

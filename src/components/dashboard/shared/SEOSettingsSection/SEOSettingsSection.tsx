import React from "react";
import { UseFormRegister, Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { FormSection, FormSpec, KeywordsField } from "@/components/dashboard/FormFields";
import styles from "./SEOSettingsSection.module.scss";

interface SEOSettingsSectionProps<T extends FieldValues> {
  seoLang: Language;
  setSeoLang: (lang: Language) => void;
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  title?: string;
}

export default function SEOSettingsSection<T extends FieldValues>({
  seoLang,
  setSeoLang,
  register,
  control,
  errors,
  title = "SEO Settings",
}: SEOSettingsSectionProps<T>) {
  return (
    <FormSection title={title} iconSrc="/images/dashboard/fields/seo-settings.svg">
      <FormSpec>
        <LanguageTabs active={seoLang} onChange={setSeoLang} className={styles.whiteTabs} />
        <DashboardField
          label="Meta Title"
          placeholder="Meta Title..."
          {...register("metaTitle" as Path<T>)}
          error={errors.metaTitle?.message as string}
        />
        <DashboardField
          control="textarea"
          label="Meta Description"
          placeholder="SEO description (max 300 char..."
          maxLength={300}
          {...register("metaDescription" as Path<T>)}
          error={errors.metaDescription?.message as string}
        />
        <Controller
          name={"metaKeywords" as Path<T>}
          control={control}
          render={({ field }) => (
            <KeywordsField
              label="Meta keywords"
              value={field.value as string[]}
              onChange={field.onChange}
              error={errors.metaKeywords?.message as string}
            />
          )}
        />
        <DashboardField
          label="Slug"
          placeholder="e.g. your-page-url-slug"
          {...register("slug" as Path<T>)}
          error={errors.slug?.message as string}
        />
      </FormSpec>
    </FormSection>
  );
}

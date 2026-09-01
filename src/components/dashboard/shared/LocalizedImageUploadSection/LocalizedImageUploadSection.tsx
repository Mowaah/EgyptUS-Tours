"use client";

import React from "react";
import { Controller } from "react-hook-form";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { FormSection, FormSpec, UploadDropzone } from "@/components/dashboard/FormFields";

export interface LocalizedImageUploadSectionProps {
  title: string;
  iconSrc: string;
  fileFieldName: string;
  titleFieldNameBase: string;
  altFieldNameBase: string;
  titleLabel: string;
  altLabel: string;
  titlePlaceholder: string;
  altPlaceholder: string;
  lang: Language;
  setLang: (lang: Language) => void;
  control: any;
  register: any;
  errors: any;
  registerPathFn?: (langCode: "en" | "it" | "es", fieldName: string) => string;
}

export default function LocalizedImageUploadSection({
  title,
  iconSrc,
  fileFieldName,
  titleFieldNameBase,
  altFieldNameBase,
  titleLabel,
  altLabel,
  titlePlaceholder,
  altPlaceholder,
  lang,
  setLang,
  control,
  register,
  errors,
  registerPathFn
}: LocalizedImageUploadSectionProps) {
  const langMap: Record<Language, "en" | "it" | "es"> = {
    English: "en",
    Italian: "it",
    Spanish: "es",
  };

  const currentLangCode = langMap[lang];

  const getPath = (fieldName: string) => {
    if (registerPathFn) {
      return registerPathFn(currentLangCode, fieldName);
    }
    return `translations.${currentLangCode}.${fieldName}`;
  };

  const getError = (fieldName: string) => {
    if (registerPathFn) {
      // Very basic generic fallback for custom paths, might need tweaking based on usage
      const pathParts = registerPathFn(currentLangCode, fieldName).split('.');
      let errObj = errors;
      for (const part of pathParts) {
        if (!errObj) break;
        errObj = errObj[part];
      }
      return errObj?.message;
    }
    return errors.translations?.[currentLangCode]?.[fieldName]?.message;
  };

  return (
    <FormSection title={title} iconSrc={iconSrc}>
      <FormSpec>
        <Controller
          name={fileFieldName}
          control={control}
          render={({ field }) => (
            <UploadDropzone onFileSelect={field.onChange} value={field.value} />
          )}
        />
        <LanguageTabs 
          active={lang} 
          onChange={setLang} 
          variant="white"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
          <DashboardField 
            key={`${titleFieldNameBase}-${lang}`} 
            label={titleLabel} 
            placeholder={titlePlaceholder} 
            {...register(getPath(titleFieldNameBase))} 
            error={getError(titleFieldNameBase)} 
          />
          <DashboardField 
            key={`${altFieldNameBase}-${lang}`} 
            label={altLabel} 
            placeholder={altPlaceholder} 
            {...register(getPath(altFieldNameBase))} 
            error={getError(altFieldNameBase)} 
          />
        </div>
      </FormSpec>
    </FormSection>
  );
}

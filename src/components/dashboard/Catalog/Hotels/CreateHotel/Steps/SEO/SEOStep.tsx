import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import SEOSettingsSection from "@/components/dashboard/shared/SEOSettingsSection/SEOSettingsSection";
import { CreateHotelValues } from "../../CreateHotelSchema";
import { Language } from "@/components/shared/LanguageTabs/LanguageTabs";

export function SEOStep() {
  const [seoLang, setSeoLang] = useState<Language>("English");
  
  const { register, control, formState: { errors } } = useFormContext<CreateHotelValues>();

  useEffect(() => {
    if (errors.metaTitle) {
      if (errors.metaTitle.en) setSeoLang("English");
      else if (errors.metaTitle.it) setSeoLang("Italian");
      else if (errors.metaTitle.es) setSeoLang("Spanish");
    } else if (errors.metaDescription) {
      if (errors.metaDescription.en) setSeoLang("English");
      else if (errors.metaDescription.it) setSeoLang("Italian");
      else if (errors.metaDescription.es) setSeoLang("Spanish");
    } else if (errors.slug) {
      if (errors.slug.en) setSeoLang("English");
      else if (errors.slug.it) setSeoLang("Italian");
      else if (errors.slug.es) setSeoLang("Spanish");
    }
  }, [errors.metaTitle, errors.metaDescription, errors.slug]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SEOSettingsSection
        title="General SEO"
        seoLang={seoLang}
        setSeoLang={setSeoLang}
        register={register as any}
        control={control as any}
        errors={errors}
      />
    </div>
  );
}

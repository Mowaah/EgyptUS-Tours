import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import SEOSettingsSection from "@/components/dashboard/shared/SEOSettingsSection/SEOSettingsSection";
import { CreateHotelValues } from "../../CreateHotelSchema";
import { Language } from "@/components/shared/LanguageTabs/LanguageTabs";

export function SEOStep() {
  const [seoLang, setSeoLang] = useState<Language>("English");
  
  const { register, control, formState: { errors } } = useFormContext<CreateHotelValues>();

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

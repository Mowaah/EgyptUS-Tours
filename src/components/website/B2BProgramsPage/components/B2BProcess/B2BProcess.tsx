"use client";

import ProcessTimeline from "@/components/shared/ProcessTimeline/ProcessTimeline";
import { useTranslation } from "@/hooks/useTranslation";

export default function B2BProcess() {
  const { t } = useTranslation("b2b");

  const steps = [
    {
      number: "01",
      title: t("process.step1Title", "Understand Your Requirement"),
      description: t("process.step1Desc", "We learn your clients' needs, destinations, and budget."),
    },
    {
      number: "02",
      title: t("process.step2Title", "Design the Program"),
      description: t("process.step2Desc", "We create a tailored itinerary with clear pricing."),
    },
    {
      number: "03",
      title: t("process.step3Title", "Confirm & Arrange"),
      description: t("process.step3Desc", "We handle hotels, transport, guides, cruises, and more."),
    },
    {
      number: "04",
      title: t("process.step4Title", "Operate the Trip"),
      description: t("process.step4Desc", "We coordinate everything and provide on-ground support."),
    },
    {
      number: "05",
      title: t("process.step5Title", "Deliver the Experience"),
      description: t("process.step5Desc", "We ensure a smooth journey from start to finish."),
    },
  ];

  return (
    <ProcessTimeline
      title={t("process.title", "From Vision to Experience")}
      subtitle={t("process.subtitle", "You bring the objective. We build everything around it")}
      steps={steps}
      sectionPadding="compact"
    />
  );
}

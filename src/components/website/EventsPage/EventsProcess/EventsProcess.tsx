"use client";

import ProcessTimeline from "@/components/shared/ProcessTimeline/ProcessTimeline";
import { useTranslation } from "@/hooks/useTranslation";

export default function EventsProcess() {
  const { t } = useTranslation("events");

  const steps = [
    {
      number: "01",
      title: t("process.step1Title", "Consultation"),
      description: t("process.step1Desc", "Understanding your event objectives and requirements"),
    },
    {
      number: "02",
      title: t("process.step2Title", "Proposal & Planning"),
      description: t("process.step2Desc", "Detailed proposal with venue options and pricing"),
    },
    {
      number: "03",
      title: t("process.step3Title", "Venue & Logistics Setup"),
      description: t("process.step3Desc", "Complete event infrastructure and coordination"),
    },
    {
      number: "04",
      title: t("process.step4Title", "Event Execution"),
      description: t("process.step4Desc", "On-site management and technical support"),
    },
    {
      number: "05",
      title: t("process.step5Title", "Post-Event Reporting"),
      description: t("process.step5Desc", "Comprehensive reporting and feedback analysis"),
      active: false,
    },
  ];

  return (
    <ProcessTimeline
      title={t("process.title", "Our Events' Process")}
      subtitle={t("process.subtitle", "Structured approach ensuring flawless execution")}
      steps={steps}
      sectionPadding="large"
    />
  );
}

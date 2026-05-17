"use client";

import ProcessTimeline from "@/components/shared/ProcessTimeline/ProcessTimeline";

const STEPS = [
  {
    number: "01",
    title: "Consultation",
    description: "Understanding your event objectives and requirements",
  },
  {
    number: "02",
    title: "Proposal & Planning",
    description: "Detailed proposal with venue options and pricing",
  },
  {
    number: "03",
    title: "Venue & Logistics Setup",
    description: "Complete event infrastructure and coordination",
  },
  {
    number: "04",
    title: "Event Execution",
    description: "On-site management and technical support",
  },
  {
    number: "05",
    title: "Post-Event Reporting",
    description: "Comprehensive reporting and feedback analysis",
    active: false,
  },
];

export default function EventsProcess() {
  return (
    <ProcessTimeline
      title="Our Events' Process"
      subtitle="Structured approach ensuring flawless execution"
      steps={STEPS}
      sectionPadding="large"
    />
  );
}

"use client";

import ProcessTimeline from "@/components/shared/ProcessTimeline/ProcessTimeline";

const STEPS = [
  {
    number: "01",
    title: "Understand Your Objectives",
    description: "We start by learning about your goals, audience, and expectations.",
  },
  {
    number: "02",
    title: "Design a Tailored Proposal",
    description: "A custom plan with transparent pricing and clear deliverables.",
  },
  {
    number: "03",
    title: "Venue & Logistics Setup",
    description: "Complete event infrastructure and coordination",
  },
  {
    number: "04",
    title: "Execute & Coordinate",
    description: "Seamless logistics, vendor management, and on-site support.",
  },
  {
    number: "05",
    title: "Measurable Experience",
    description: "Post-event reporting and feedback to ensure continuous improvement.",
  },
];

export default function B2BProcess() {
  return (
    <ProcessTimeline
      title="Our Proven Corporate Process"
      subtitle="A systematic approach that ensures every corporate event exceeds expectations."
      steps={STEPS}
      sectionPadding="normal"
    />
  );
}

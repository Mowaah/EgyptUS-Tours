import ProcessTimeline from "@/components/shared/ProcessTimeline/ProcessTimeline";

const STEPS = [
  {
    number: "01",
    title: "Understand Your Requirement",
    description: "We learn your clients' needs, destinations, and budget.",
  },
  {
    number: "02",
    title: "Design the Program",
    description: "We create a tailored itinerary with clear pricing.",
  },
  {
    number: "03",
    title: "Confirm & Arrange",
    description: "We handle hotels, transport, guides, cruises, and more.",
  },
  {
    number: "04",
    title: "Operate the Trip",
    description: "We coordinate everything and provide on-ground support.",
  },
  {
    number: "05",
    title: "Deliver the Experience",
    description: "We ensure a smooth journey from start to finish.",
  },
];

export default function B2BProcess() {
  return (
    <ProcessTimeline
      title="From Vision to Experience"
      subtitle="You bring the objective. We build everything around it"
      steps={STEPS}
      sectionPadding="compact"
    />
  );
}

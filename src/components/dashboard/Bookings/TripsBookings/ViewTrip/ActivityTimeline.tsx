import { ActivityTimeline, Milestone } from "@/components/dashboard/shared";

interface ActivityTimelineProps {
  events: any[];
}

export default function TripsActivityTimeline({ events }: ActivityTimelineProps) {
  let activities: Milestone[] = [];

  if (events && events.length > 0) {
    activities = events.map((e: any) => ({
      id: String(e.id),
      title: e.activity_type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      description: e.description || "-",
      time: new Date(e.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "completed"
    }));
  }

  return <ActivityTimeline milestones={activities} />;
}

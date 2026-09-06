import { ActivityTimeline, Milestone } from "@/components/dashboard/shared";

interface ActivityTimelineProps {
  events: any[];
}

export default function TransportationActivityTimeline({ events }: ActivityTimelineProps) {
  let activities: Milestone[] = [];

  if (events && events.length > 0) {
    activities = events.map((e: any) => {
      const isReassigned =
        e.activity_type === "reassigned" ||
        (e.activity_type === "assigned" && Boolean(e.metadata?.previous_assignee_id)) ||
        e.description?.toLowerCase().startsWith("reassigned to");

      let title = isReassigned
        ? "Reassigned"
        : e.activity_type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

      if (e.actor_name) {
        title += ` by ${e.actor_name}`;
      }

      let description = e.description || "-";
      if (isReassigned && description.startsWith("Assigned to")) {
        description = description.replace(/^Assigned to/, "Reassigned to");
      }

      return {
        id: String(e.id),
        title,
        description,
        time: new Date(e.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: "completed"
      };
    });
  }

  return <ActivityTimeline milestones={activities} />;
}

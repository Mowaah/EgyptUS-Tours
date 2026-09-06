import React, { useMemo } from "react";
import { ActivityTimeline, Milestone } from "@/components/dashboard/shared";
import { useLeadTimeline } from "@/hooks/useLeads";
import type { AdminLeadTimelineEvent } from "@/types/adminLeadTypes";

interface ActivityTimelineProps {
  leadId: number;
}

export default function LeadActivityTimeline({ leadId }: ActivityTimelineProps) {
  const { data: events, isLoading } = useLeadTimeline(leadId);

  const milestones: Milestone[] = useMemo(() => {
    if (!events) return [];
    
    return events.map((event: AdminLeadTimelineEvent) => {
      const isReassigned =
        event.activity_type === "reassigned" ||
        (event.activity_type === "assigned" && Boolean((event as any).metadata?.previous_assignee_id)) ||
        event.description?.toLowerCase().startsWith("reassigned to") ||
        event.description?.toLowerCase().startsWith("batch reassigned to");

      const title = isReassigned
        ? "Reassigned"
        : event.activity_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      let description = event.description || "";
      if (isReassigned && description.startsWith("Assigned to")) {
        description = description.replace(/^Assigned to/, "Reassigned to");
      }

      return {
        id: event.id.toString(),
        title,
        time: new Date(event.created_at).toLocaleString("en-US", { 
          month: "short", 
          day: "numeric", 
          hour: "numeric", 
          minute: "numeric", 
          hour12: true 
        }),
        description,
        status: "completed",
      };
    });
  }, [events]);

  if (isLoading) {
    return <div>Loading timeline...</div>;
  }

  if (!events || events.length === 0) {
    return <div>No activity yet.</div>;
  }

  return <ActivityTimeline milestones={milestones} />;
}

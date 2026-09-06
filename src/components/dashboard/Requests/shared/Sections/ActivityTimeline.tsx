import React from "react";
import { ActivityTimeline, Milestone } from "@/components/dashboard/shared";

interface TimelineRow {
  activity_type: string;
  description: string;
  created_at: string;
  actor_name?: string;
  metadata?: {
    assignee_id?: number | string;
    previous_assignee_id?: number | string | null;
    [key: string]: any;
  };
}

interface ActivityTimelineWrapperProps {
  timelineRows?: TimelineRow[];
}

export default function ActivityTimelineWrapper({ timelineRows = [] }: ActivityTimelineWrapperProps) {
  const milestones: Milestone[] = timelineRows.map((row, index) => {
    const date = new Date(row.created_at);
    const timeString = `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    
    const isReassigned =
      row.activity_type === "reassigned" ||
      (row.activity_type === "assigned" && Boolean(row.metadata?.previous_assignee_id)) ||
      row.description?.toLowerCase().startsWith("reassigned to") ||
      row.description?.toLowerCase().startsWith("batch reassigned to");

    const actionLabel = isReassigned
      ? "Reassigned"
      : row.activity_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    let title = actionLabel;
    if (row.actor_name) {
      title += ` by ${row.actor_name}`;
    }

    let description = row.description || "Status updated.";
    if (isReassigned && description.startsWith("Assigned to")) {
      description = description.replace(/^Assigned to/, "Reassigned to");
    }

    return {
      id: index.toString(),
      title,
      description,
      time: timeString,
      status: "completed"
    };
  });

  if (milestones.length === 0) {
    return (
      <div style={{ color: "#666", fontStyle: "italic", padding: "10px 0" }}>
        No activity yet.
      </div>
    );
  }

  return <ActivityTimeline milestones={milestones} />;
}

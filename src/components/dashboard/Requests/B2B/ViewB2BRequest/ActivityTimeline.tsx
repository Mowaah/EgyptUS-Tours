import React from "react";
import { ActivityTimeline, Milestone } from "@/components/dashboard/shared";

interface TimelineRow {
  activity_type: string;
  description: string;
  created_at: string;
  actor_name?: string;
}

interface ActivityTimelineWrapperProps {
  timelineRows?: TimelineRow[];
}

export default function ActivityTimelineWrapper({ timelineRows = [] }: ActivityTimelineWrapperProps) {
  const milestones: Milestone[] = timelineRows.map((row, index) => {
    const date = new Date(row.created_at);
    const timeString = `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    
    let title = row.activity_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    if (row.actor_name) {
      title += ` by ${row.actor_name}`;
    }

    return {
      id: index.toString(),
      title,
      description: row.description || "Status updated.",
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

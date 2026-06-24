import React from "react";
import Image from "next/image";
import styles from "./ViewLead.module.scss";

type MilestoneStatus = "completed" | "pending";

interface Milestone {
  id: string;
  title: string;
  time?: string;
  description: string;
  status: MilestoneStatus;
}

interface ActivityTimelineProps {
  milestones?: Milestone[];
}

const defaultMilestones: Milestone[] = [
  {
    id: "m1",
    title: "Lead Created",
    time: "Oct 26, 09:14 AM",
    description: "Lead imported and assigned to Ahmed Hassan",
    status: "completed",
  },
  {
    id: "m2",
    title: "Note Added",
    time: "Oct 26, 09:14 AM",
    description: "Customer confirmed interest in a 7-day Egypt travel package including Cairo, Luxor, and Aswan. Travel dates have been finalized for the second week of December, and the estimated budget aligns with the proposed package options. The customer requested a detailed quotation including accommodation, transportation, and guided tours. Lead has been qualified and is ready for the next stage of proposal preparation and booking coordination.",
    status: "completed",
  },
  {
    id: "m3",
    title: "Lead Contacted",
    time: "Oct 26, 09:14 AM",
    description: "Interested in Cairo & Luxor package.",
    status: "completed",
  },
  {
    id: "m4",
    title: "Lead Qualified",
    time: "Oct 26, 09:14 AM",
    description: "Customer confirmed travel dates and budget.",
    status: "completed",
  },
  {
    id: "m5",
    title: "Lead Converted to Request",
    time: "--",
    description: "Custom trip request created and assigned to Operations.",
    status: "pending",
  },
  {
    id: "m6",
    title: "Lead Closed",
    time: "--",
    description: "Reason: Not Qualified",
    status: "pending",
  },
];

export default function ActivityTimeline({ milestones = defaultMilestones }: ActivityTimelineProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleIcon}>
          <Image
            src="/images/dashboard/inquiries/activity_timeline.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        Activity Timeline
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineLine} />
        {milestones.map((milestone) => (
          <div 
            key={milestone.id} 
            className={`${styles.milestone} ${milestone.status === "pending" ? styles.milestonePending : ""}`}
          >
            <div className={`${styles.iconWrapper} ${milestone.status === "completed" ? styles.iconCompleted : styles.iconPending}`}>
              {milestone.status === "completed" ? (
                <Image
                  src="/images/check-white.svg"
                  alt="Completed"
                  width={18}
                  height={18}
                />
              ) : (
                <div className={styles.dot} />
              )}
            </div>
            
            <div className={styles.milestoneContent}>
              <div className={styles.milestoneHeader}>
                <span className={styles.milestoneTitle}>{milestone.title}</span>
                <span className={styles.milestoneTime}>{milestone.time}</span>
              </div>
              <p className={styles.milestoneDesc}>{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

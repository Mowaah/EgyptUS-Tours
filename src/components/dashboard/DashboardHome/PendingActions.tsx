"use client";

import Image from "next/image";
import { useState } from "react";
import { pendingActions } from "./dashboardHomeData";
import { iconPath } from "./utils";
import styles from "./DashboardHome.module.scss";

export default function PendingActions() {
  const [activeAction, setActiveAction] = useState(pendingActions[0]?.title ?? "");
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const toggleCompleted = (title: string) => {
    setCompletedActions((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title]
    );
    setActiveAction(title);
  };

  return (
    <div className={styles.actionList}>
      {pendingActions.map((action) => (
        <button
          type="button"
          className={`${styles.actionItem} ${activeAction === action.title ? styles.actionActive : ""} ${
            completedActions.includes(action.title) ? styles.actionDone : ""
          }`}
          aria-pressed={completedActions.includes(action.title)}
          onClick={() => toggleCompleted(action.title)}
          key={action.title}
        >
          <div className={`${styles.actionIcon} ${styles[action.tone]}`} aria-hidden>
            <Image src={iconPath(action.icon)} alt="" width={18} height={18} />
          </div>
          <div className={styles.actionText}>
            <strong>{action.title}</strong>
            <span>{completedActions.includes(action.title) ? "Marked as reviewed" : action.time}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { pendingActions } from "../dashboardHomeData";
import styles from "./PendingActions.module.scss";

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
    <div className={styles.list}>
      {pendingActions.map((action) => (
        <button
          type="button"
          className={`${styles.item} ${activeAction === action.title ? styles.active : ""} ${
            completedActions.includes(action.title) ? styles.done : ""
          }`}
          aria-pressed={completedActions.includes(action.title)}
          onClick={() => toggleCompleted(action.title)}
          key={action.title}
        >
          <div className={`${styles.icon} ${styles[action.tone]}`} aria-hidden>
            <Image src={`/images/dashboard/${action.icon}.svg`} alt="" width={18} height={18} />
          </div>
          <div className={styles.text}>
            <strong>{action.title}</strong>
            <span>
              {completedActions.includes(action.title) ? "Marked as reviewed" : action.time}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

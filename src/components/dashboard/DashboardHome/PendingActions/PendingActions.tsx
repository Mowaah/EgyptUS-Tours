"use client";

import Image from "next/image";
import { useState } from "react";
import type { PendingAction } from "../types";
import styles from "./PendingActions.module.scss";

interface PendingActionsProps {
  pendingActions: PendingAction[];
}

export default function PendingActions({ pendingActions }: PendingActionsProps) {
  const [activeAction, setActiveAction] = useState(pendingActions?.[0]?.path ?? "");
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const toggleCompleted = (path: string) => {
    setCompletedActions((current) =>
      current.includes(path) ? current.filter((item) => item !== path) : [...current, path]
    );
    setActiveAction(path);
  };

  return (
    <div className={styles.list}>
      {pendingActions.map((action) => (
        <button
          type="button"
          className={`${styles.item} ${activeAction === action.path ? styles.active : ""} ${
            completedActions.includes(action.path) ? styles.done : ""
          }`}
          aria-pressed={completedActions.includes(action.path)}
          onClick={() => toggleCompleted(action.path)}
          key={action.path}
        >
          <div className={`${styles.icon} ${styles[action.tone]}`} aria-hidden>
            <Image src={`/images/dashboard/${action.icon}.svg`} alt="" width={18} height={18} />
          </div>
          <div className={styles.text}>
            <strong>{action.title}</strong>
            <span>
              {completedActions.includes(action.path) ? "Marked as reviewed" : action.time}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

import React from "react";
import styles from "./ProfileHeader.module.scss";

export type PillVariant = "blue" | "green" | "red" | "orange" | "gray" | "purple";

interface ProfileHeaderProps {
  title: React.ReactNode;
  pillLabel?: string;
  pillVariant?: PillVariant;
  subtitleElements?: React.ReactNode[];
  actionButtons?: React.ReactNode;
}

export default function ProfileHeader({
  title,
  pillLabel,
  pillVariant = "blue",
  subtitleElements = [],
  actionButtons,
}: ProfileHeaderProps) {
  // Determine pill class
  let pillClass = styles.pillBlue;
  switch (pillVariant) {
    case "green":
      pillClass = styles.pillGreen;
      break;
    case "red":
      pillClass = styles.pillRed;
      break;
    case "orange":
      pillClass = styles.pillOrange;
      break;
    case "gray":
      pillClass = styles.pillGray;
      break;
    case "purple":
      pillClass = styles.pillPurple;
      break;
  }

  return (
    <div className={styles.headerContent}>
      <div className={styles.headerInfo}>
        <div className={styles.titleRow}>
          <h1>{title}</h1>
          {pillLabel && (
            <span className={`${styles.pill} ${pillClass}`}>
              <i aria-hidden />
              {pillLabel}
            </span>
          )}
        </div>
        
        {subtitleElements.length > 0 && (
          <div className={styles.subtitleRow}>
            {subtitleElements.map((element, index) => (
              <React.Fragment key={index}>
                <span>{element}</span>
                {index < subtitleElements.length - 1 && (
                  <span className={styles.dot}>•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {actionButtons && (
        <div className={styles.headerActions}>
          {actionButtons}
        </div>
      )}
    </div>
  );
}

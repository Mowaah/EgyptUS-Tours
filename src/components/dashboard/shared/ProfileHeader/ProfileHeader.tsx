import React from "react";
import Image from "next/image";
import styles from "./ProfileHeader.module.scss";

export type PillVariant = "blue" | "green" | "red" | "orange" | "gray" | "purple";

export interface ProfileActionConfig {
  label: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  iconSize?: number;
  onClick?: () => void;
}

interface ProfileHeaderProps {
  title: React.ReactNode;
  avatar?: React.ReactNode;
  pillLabel?: string;
  pillVariant?: PillVariant;
  customPills?: React.ReactNode;
  subtitleElements?: React.ReactNode[];
  actionButtons?: React.ReactNode;
  primaryAction?: ProfileActionConfig;
  secondaryAction?: ProfileActionConfig;
  archiveAction?: ProfileActionConfig;
  dangerAction?: ProfileActionConfig;
}

export default function ProfileHeader({
  title,
  avatar,
  pillLabel,
  pillVariant = "blue",
  customPills,
  subtitleElements = [],
  actionButtons,
  primaryAction,
  secondaryAction,
  archiveAction,
  dangerAction,
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
      <div className={styles.leftContent}>
        {avatar && <div className={styles.avatarContainer}>{avatar}</div>}
        <div className={styles.headerInfo}>
          <div className={styles.titleRow}>
            <h1>{title}</h1>
            {pillLabel && (
              <span className={`${styles.pill} ${pillClass}`}>
                <i aria-hidden />
                {pillLabel}
              </span>
            )}
            {customPills}
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
      </div>

      {(actionButtons || primaryAction || secondaryAction || archiveAction || dangerAction) && (
        <div className={styles.headerActions}>
          {actionButtons}

          {secondaryAction && (
            <button className={styles.secondaryActionButton} onClick={secondaryAction.onClick}>
              {secondaryAction.icon && secondaryAction.iconPosition !== "right" && (
                typeof secondaryAction.icon === "string" 
                  ? <Image src={secondaryAction.icon} alt="" width={secondaryAction.iconSize || 20} height={secondaryAction.iconSize || 20} />
                  : secondaryAction.icon
              )}
              {secondaryAction.label}
              {secondaryAction.icon && secondaryAction.iconPosition === "right" && (
                typeof secondaryAction.icon === "string"
                  ? <Image src={secondaryAction.icon} alt="" width={secondaryAction.iconSize || 20} height={secondaryAction.iconSize || 20} />
                  : secondaryAction.icon
              )}
            </button>
          )}

          {archiveAction && (
            <button className={styles.archiveActionButton} onClick={archiveAction.onClick}>
              {archiveAction.icon && archiveAction.iconPosition !== "right" && (
                typeof archiveAction.icon === "string"
                  ? <Image src={archiveAction.icon} alt="" width={archiveAction.iconSize || 20} height={archiveAction.iconSize || 20} />
                  : archiveAction.icon
              )}
              {archiveAction.label}
              {archiveAction.icon && archiveAction.iconPosition === "right" && (
                typeof archiveAction.icon === "string"
                  ? <Image src={archiveAction.icon} alt="" width={archiveAction.iconSize || 20} height={archiveAction.iconSize || 20} />
                  : archiveAction.icon
              )}
            </button>
          )}

          {dangerAction && (
            <button className={styles.dangerActionButton} onClick={dangerAction.onClick}>
              {dangerAction.icon && dangerAction.iconPosition !== "right" && (
                typeof dangerAction.icon === "string"
                  ? <Image src={dangerAction.icon} alt="" width={dangerAction.iconSize || 20} height={dangerAction.iconSize || 20} />
                  : dangerAction.icon
              )}
              {dangerAction.label}
              {dangerAction.icon && dangerAction.iconPosition === "right" && (
                typeof dangerAction.icon === "string"
                  ? <Image src={dangerAction.icon} alt="" width={dangerAction.iconSize || 20} height={dangerAction.iconSize || 20} />
                  : dangerAction.icon
              )}
            </button>
          )}

          {primaryAction && (
            <button className={styles.primaryActionButton} onClick={primaryAction.onClick}>
              {primaryAction.icon && primaryAction.iconPosition !== "right" && (
                typeof primaryAction.icon === "string"
                  ? <Image src={primaryAction.icon} alt="" width={primaryAction.iconSize || 20} height={primaryAction.iconSize || 20} />
                  : primaryAction.icon
              )}
              {primaryAction.label}
              {primaryAction.icon && primaryAction.iconPosition === "right" && (
                typeof primaryAction.icon === "string"
                  ? <Image src={primaryAction.icon} alt="" width={primaryAction.iconSize || 20} height={primaryAction.iconSize || 20} />
                  : primaryAction.icon
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

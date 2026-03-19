import styles from "./SectionHeader.module.scss";
import Image from "next/image";

interface SectionHeaderProps {
  label: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  icon?: React.ReactNode;
  maxWidth?: string;
  headingClassName?: string;
  headingMaxWidth?: string;
  descriptionMaxWidth?: string;
  showLabel?: boolean;
}

export default function SectionHeader({
  label,
  heading,
  description,
  align = "center",
  icon,
  maxWidth,
  headingClassName,
  headingMaxWidth,
  descriptionMaxWidth,
  showLabel = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`${styles.header} ${styles[align]}`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {showLabel && (
        <span className={styles.label}>
          {icon || (
            <Image
              src="/images/trips2.svg"
              alt="Trips"
              width={18}
              height={18}
              className={styles.labelIcon}
            />
          )}
          {label}
        </span>
      )}
      <h2
        className={`${styles.heading} ${headingClassName || ""}`}
        style={headingMaxWidth ? { maxWidth: headingMaxWidth } : undefined}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={styles.description}
          style={descriptionMaxWidth ? { maxWidth: descriptionMaxWidth } : undefined}
        >
          {description}
        </p>
      )}
    </div>
  );
}

import Image from "next/image";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import styles from "./SectionHeader.module.scss";

interface SectionHeaderProps {
  label?: string;
  breadcrumbItems?: { label: string; href?: string; isCurrent?: boolean }[];
  heading: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  icon?: React.ReactNode;
  maxWidth?: string;
  headingClassName?: string;
  headingMaxWidth?: string;
  descriptionMaxWidth?: string;
  showLabel?: boolean;
  size?: "normal" | "large";
}

export default function SectionHeader({
  label,
  breadcrumbItems,
  heading,
  description,
  align = "center",
  icon,
  maxWidth,
  headingClassName,
  headingMaxWidth,
  descriptionMaxWidth,
  showLabel = true,
  size = "normal",
}: SectionHeaderProps) {
  const sizeClass = size === "large" ? styles.headingLarge : "";
  return (
    <div
      className={`${styles.header} ${styles[align]}`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {showLabel && (
        <>
          {breadcrumbItems ? (
            <Breadcrumb items={breadcrumbItems} />
          ) : (
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
        </>
      )}
      <h2
        className={`${styles.heading} ${sizeClass} ${headingClassName || ""}`}
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

import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./BookingDetailsSections.module.scss";

export interface BookingDetailsField {
  label: string;
  value: ReactNode;
}

export interface BookingDetailsSection {
  title: string;
  icon: string;
  fields?: BookingDetailsField[];
  fieldsColumns?: 1 | 2 | 3 | 4;
  listItems?: ReactNode[];
  descriptionLabel?: string;
  description?: ReactNode;
  emptyStateText?: string;
}

interface BookingDetailsSectionsProps {
  sections: BookingDetailsSection[];
  className?: string;
}

export default function BookingDetailsSections({
  sections,
  className,
}: BookingDetailsSectionsProps) {
  return (
    <div className={`${styles.sections} ${className ?? ""}`}>
      {sections.map((section) => (
        <article className={styles.section} key={section.title}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <Image src={section.icon} alt="" width={16} height={16} />
            </span>
            <span className={styles.sectionTitle}>{section.title}</span>
          </div>

          {section.fields && section.fields.length > 0 && (
            <div
              className={`${styles.grid} ${
                section.fieldsColumns === 1
                  ? styles.gridCols1
                  : section.fieldsColumns === 3
                    ? styles.gridCols3
                    : section.fieldsColumns === 4
                      ? styles.gridCols4
                      : styles.gridCols2
              }`}
            >
              {section.fields.map((field) => (
                <div key={field.label} className={styles.gridItem}>
                  <label>{field.label}</label>
                  <span>{field.value}</span>
                </div>
              ))}
            </div>
          )}

          {section.description && (
            <div className={styles.descriptionWrap}>
              {section.descriptionLabel && (
                <span className={styles.descriptionLabel}>{section.descriptionLabel}</span>
              )}
              <p className={styles.description}>{section.description}</p>
            </div>
          )}

          {section.listItems && section.listItems.length > 0 && (
            <ul className={styles.list}>
              {section.listItems.map((item, index) => (
                <li key={`${section.title}-${index}`}>
                  <span className={styles.bullet} aria-hidden>
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {section.emptyStateText && (!section.listItems || section.listItems.length === 0) && (
            <p className={styles.emptyText}>{section.emptyStateText}</p>
          )}
        </article>
      ))}
    </div>
  );
}

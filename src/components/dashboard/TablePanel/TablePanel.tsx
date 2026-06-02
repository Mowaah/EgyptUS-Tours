import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./TablePanel.module.scss";

export interface TablePanelProps {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  /** Full header override (e.g. PanelHeader + View All link). */
  header?: ReactNode;
  title?: string;
  iconSrc?: string;
  headerActions?: ReactNode;
  toolbar?: ReactNode;
}

export default function TablePanel({
  ariaLabel,
  children,
  className,
  header,
  title,
  iconSrc,
  headerActions,
  toolbar,
}: TablePanelProps) {
  const panelClassName = className ? `${styles.panel} ${className}` : styles.panel;

  return (
    <section className={panelClassName} aria-label={ariaLabel}>
      {header ?? (
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            {iconSrc ? (
              <span className={styles.panelIcon} aria-hidden>
                <Image src={iconSrc} alt="" width={20} height={20} />
              </span>
            ) : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          {headerActions ? <div className={styles.panelActions}>{headerActions}</div> : null}
        </div>
      )}

      {toolbar}

      {children}
    </section>
  );
}

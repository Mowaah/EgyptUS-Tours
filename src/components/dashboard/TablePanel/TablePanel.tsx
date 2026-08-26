import Image from "next/image";
import { useState, type ReactNode } from "react";
import TablePanelHeaderButton from "./TablePanelHeaderButton";
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
  showFilters?: boolean;
  onFilterClick?: () => void;
  showExport?: boolean;
  exportLabel?: string;
  onExportClick?: () => void;
  alwaysShowToolbar?: boolean;
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
  showFilters,
  onFilterClick,
  showExport,
  exportLabel = "Export Data",
  onExportClick,
  alwaysShowToolbar,
}: TablePanelProps) {
  const panelClassName = className ? `${styles.panel} ${className}` : styles.panel;
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  const handleFilterClick = () => {
    setIsToolbarOpen((prev) => !prev);
    onFilterClick?.();
  };

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
          {headerActions ? (
            <div className={styles.panelActions}>{headerActions}</div>
          ) : showFilters || showExport ? (
            <div className={styles.panelActions}>
              {showFilters && (
                <TablePanelHeaderButton iconSrc="/images/dashboard/filter.svg" onClick={handleFilterClick}>
                  Filters
                </TablePanelHeaderButton>
              )}
              {showExport && (
                <TablePanelHeaderButton iconSrc="/images/dashboard/export.svg" onClick={onExportClick}>
                  {exportLabel}
                </TablePanelHeaderButton>
              )}
            </div>
          ) : null}
        </div>
      )}

      {(isToolbarOpen || alwaysShowToolbar) && toolbar ? <div style={{ marginBottom: "24px" }}>{toolbar}</div> : null}

      {children}
    </section>
  );
}

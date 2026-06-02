import type { ReactNode } from "react";
import { FilterSelect } from "./FilterSelect";
import styles from "./TablePanel.module.scss";

export interface TablePanelFilterField {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

interface TablePanelFilterBarProps {
  fields: TablePanelFilterField[];
  onClean: () => void;
  onApply?: () => void;
  applyLabel?: string;
  cleanLabel?: string;
  trailing?: ReactNode;
}

export default function TablePanelFilterBar({
  fields,
  onClean,
  onApply,
  applyLabel = "Apply",
  cleanLabel = "Clean",
  trailing,
}: TablePanelFilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterFields}>
        {fields.map((field) => (
          <FilterSelect
            key={field.id}
            id={field.id}
            label={field.label}
            value={field.value}
            options={field.options}
            onChange={field.onChange}
          />
        ))}
      </div>
      <div className={styles.filterActions}>
        <button type="button" className={styles.cleanButton} onClick={onClean}>
          {cleanLabel}
        </button>
        <button type="button" className={styles.applyButton} onClick={onApply}>
          {applyLabel}
        </button>
        {trailing}
      </div>
    </div>
  );
}

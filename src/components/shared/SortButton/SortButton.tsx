"use client";

import { useState } from "react";
import Image from "next/image";
import CheckboxDropdown from "@/components/shared/CheckboxDropdown/CheckboxDropdown";
import styles from "./SortButton.module.scss";

interface SortOption {
  value: string;
  label: string;
}

interface SortButtonProps {
  options: SortOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** When false, hides the "Sort by:" label (e.g. tight mobile toolbars) */
  showLabel?: boolean;
}

export default function SortButton({
  options,
  defaultValue,
  onChange,
  showLabel = true,
}: SortButtonProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value);

  const selectedLabel = options.find((o) => o.value === selectedValue)?.label || options[0]?.label;

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  return (
    <div className={[styles.sort, !showLabel && styles.compact].filter(Boolean).join(" ")}>
      {showLabel && <span className={styles.label}>Sort by:</span>}
      <CheckboxDropdown
        options={options}
        value={selectedValue}
        onChange={handleSelect}
        checkboxStyle="radio"
        wrapperClassName={!showLabel ? styles.compactDropdownWrap : undefined}
        dropdownClassName={[styles.dropdownOverride, !showLabel && styles.dropdownOverrideCompact]
          .filter(Boolean)
          .join(" ")}
        menuItemTextClassName={styles.sortMenuItemText}
        renderTrigger={(isOpen, setIsOpen) => (
          <button
            type="button"
            className={`${styles.selectBtn} ${isOpen ? styles.selectBtnOpen : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.selectText}>{selectedLabel}</span>
            <Image
              src="/images/arrows/arrow-down2.svg"
              alt=""
              width={12}
              height={7}
              className={styles.arrow}
            />
          </button>
        )}
      />
    </div>
  );
}

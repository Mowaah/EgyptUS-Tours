"use client";

import Image from "next/image";
import CheckboxDropdown from "@/components/shared/CheckboxDropdown/CheckboxDropdown";
import baseStyles from "../SelectDropdown/SelectDropdown.module.scss";
import styles from "./MultiSelectDropdown.module.scss";

interface MultiSelectDropdownProps {
  id?: string;
  label?: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  dropdownClassName?: string;
  checkboxStyle?: "radio" | "checkbox" | "none";
  error?: boolean;
}

export default function MultiSelectDropdown({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  dropdownClassName = "",
  checkboxStyle = "checkbox",
  error,
}: MultiSelectDropdownProps) {
  return (
    <CheckboxDropdown
      options={options}
      value={value}
      onChange={onChange}
      multiple={true}
      checkboxStyle={checkboxStyle}
      dropdownClassName={`${baseStyles.dropdownPanel} ${dropdownClassName}`}
      renderTrigger={(isOpen, setIsOpen) => (
        <div
          id={id}
          className={`${baseStyles.dropdownTrigger} ${isOpen ? baseStyles.dropdownTriggerOpen : ""} ${error ? baseStyles.error : ""}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-label={label}
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className={`${styles.triggerContent} ${isOpen && value.length > 0 ? styles.triggerContentMultiline : ""}`}>
            {value.length === 0 ? (
              <span className={baseStyles.placeholder}>{placeholder}</span>
            ) : isOpen ? (
              <div className={styles.chipList}>
                {value.map((item) => {
                  const opt = options.find((o) => o.value === item);
                  const displayLabel = opt ? opt.label : item;
                  return (
                    <span key={item} className={styles.chip}>
                      <span className={styles.chipLabel}>{displayLabel}</span>
                      <button
                        type="button"
                        className={styles.chipClear}
                        aria-label={`Remove ${displayLabel}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(value.filter((x) => x !== item));
                        }}
                      >
                        <Image src="/images/x-close.svg" alt="" width={10} height={10} />
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className={styles.summary}>
                <span className={styles.summaryText}>
                  {options.find((o) => o.value === value[0])?.label || value[0]}
                </span>
                {value.length > 1 && (
                  <span className={styles.moreBadge}>+{value.length - 1}</span>
                )}
              </div>
            )}
          </div>

          <svg
            className={`${baseStyles.multiSelectChevron} ${isOpen ? baseStyles.multiSelectChevronOpen : ""}`}
            width={12}
            height={8}
            viewBox="0 0 10 6"
            fill="none"
            aria-hidden
          >
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    />
  );
}

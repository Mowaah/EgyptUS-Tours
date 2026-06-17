"use client";

import CheckboxDropdown from "@/components/shared/CheckboxDropdown/CheckboxDropdown";
import styles from "./SelectDropdown.module.scss";

export interface SelectOption {
  label: string;
  value: string;
  sublabel?: string;
  price?: string;
  isFree?: boolean;
  [key: string]: any; // Allow for custom properties like starCount
}

interface SelectDropdownProps<T extends SelectOption = SelectOption> {
  id?: string;
  label?: string;
  options: T[];
  value: string;
  onChange: (val: string) => void;
  /** Extra class applied to the trigger wrapper (e.g. to set a custom height) */
  triggerClassName?: string;
  /** Custom renderer for the value shown in the trigger */
  renderValue?: (value: string) => React.ReactNode;
  /** Custom renderer for each option in the list */
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
  /** Optional override for checkbox style */
  checkboxStyle?: "radio" | "checkbox" | "none";
  error?: boolean;
}

export default function SelectDropdown<T extends SelectOption = SelectOption>({
  id,
  label,
  options,
  value,
  onChange,
  triggerClassName = "",
  renderValue,
  renderOption,
  checkboxStyle = "radio",
  error,
}: SelectDropdownProps<T>) {
  const selectedOption = options.find((o) => o.value === value) ?? options[0];

  return (
    <CheckboxDropdown
      options={options}
      value={value}
      onChange={onChange}
      checkboxStyle={checkboxStyle}
      dropdownClassName={styles.dropdownPanel}
      renderOption={renderOption || ((opt) => (
        <div className={styles.option}>
          <div className={styles.optionMain}>
            <span className={styles.optionName}>{opt.label}</span>
            {opt.sublabel && (
              <span className={styles.optionSub}>{opt.sublabel}</span>
            )}
          </div>
          {opt.price && (
            <span className={opt.isFree ? styles.optionFree : styles.optionPrice}>
              {opt.price}
            </span>
          )}
        </div>
      ))}
      renderTrigger={(isOpen, setIsOpen) => (
        <div
          id={id}
          className={`${styles.dropdownTrigger} ${isOpen ? styles.dropdownTriggerOpen : ""} ${triggerClassName} ${error ? styles.error : ""}`}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-label={label}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
        >
          {renderValue && value ? (
            renderValue(value)
          ) : (
            <span className={value ? styles.dropdownValue : styles.placeholder}>
              {selectedOption?.label}
            </span>
          )}
          <svg
            className={`${styles.multiSelectChevron} ${isOpen ? styles.multiSelectChevronOpen : ""}`}
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

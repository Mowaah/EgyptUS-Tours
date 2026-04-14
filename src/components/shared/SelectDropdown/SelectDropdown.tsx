"use client";

import CheckboxDropdown from "@/components/shared/CheckboxDropdown/CheckboxDropdown";
import prefStyles from "@/components/website/PlanYourTripPage/steps/Preferences/StepPreferences.module.scss";
import styles from "./SelectDropdown.module.scss";

export interface SelectOption {
  label: string;
  value: string;
  sublabel?: string;
  price?: string;
  isFree?: boolean;
}

interface SelectDropdownProps {
  id?: string;
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  /** Extra class applied to the trigger wrapper (e.g. to set a custom height) */
  triggerClassName?: string;
}

export default function SelectDropdown({
  id,
  label,
  options,
  value,
  onChange,
  triggerClassName = "",
}: SelectDropdownProps) {
  const selectedOption = options.find((o) => o.value === value) ?? options[0];

  return (
    <CheckboxDropdown
      options={options}
      value={value}
      onChange={onChange}
      checkboxStyle="radio"
      dropdownClassName={prefStyles.prefPanel}
      renderOption={(opt) => (
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
      )}
      renderTrigger={(isOpen, setIsOpen) => (
        <div
          id={id}
          className={`${prefStyles.prefTrigger} ${isOpen ? prefStyles.prefTriggerOpen : ""} ${triggerClassName}`}
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
          <span className={prefStyles.prefTriggerValue}>
            {selectedOption?.label}
          </span>
          <svg
            className={`${prefStyles.multiSelectChevron} ${isOpen ? prefStyles.multiSelectChevronOpen : ""}`}
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

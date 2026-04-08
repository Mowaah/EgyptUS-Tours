"use client";

import { useState, useRef, useEffect } from "react";

import CheckboxIndicator from "@/components/shared/CheckboxIndicator/CheckboxIndicator";
import styles from "./CheckboxDropdown.module.scss";

export interface CheckboxOption {
  label: string;
  value: string;
  [key: string]: any;
}

export interface CheckboxDropdownProps<T extends CheckboxOption = CheckboxOption> {
  options: T[];
  value: string | string[]; // Can be string for single select or string array for multi select
  onChange: (value: any) => void;
  renderTrigger: (isOpen: boolean, setIsOpen: (o: boolean) => void) => React.ReactNode;
  multiple?: boolean;
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
  checkboxStyle?: "radio" | "checkbox" | "none";
  dropdownClassName?: string;
}

export default function CheckboxDropdown<T extends CheckboxOption>({
  options,
  value,
  onChange,
  renderTrigger,
  multiple = false,
  renderOption,
  checkboxStyle = "radio",
  dropdownClassName = "",
}: CheckboxDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const isSelected = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {renderTrigger(isOpen, setIsOpen)}

      {isOpen && (
        <div className={`${styles.dropdown} ${dropdownClassName}`}>
          {options.map((opt) => {
            const selected = isSelected(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`${styles.menuItem} ${selected ? styles.menuItemSelected : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
              >
                {checkboxStyle !== "none" && (
                  <CheckboxIndicator
                    variant={checkboxStyle === "radio" ? "radio" : "square"}
                    size="sm"
                    selected={selected}
                    aria-hidden
                  />
                )}
                {renderOption ? renderOption(opt, selected) : (
                  <span className={styles.menuItemText}>{opt.label}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

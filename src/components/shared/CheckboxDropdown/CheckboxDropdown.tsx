"use client";

import { useState, useRef, useEffect, useLayoutEffect, CSSProperties } from "react";
import { createPortal } from "react-dom";

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
  checkboxClassName?: string;
  /** Optional class for the root wrapper (e.g. shrink-to-fit sort triggers) */
  wrapperClassName?: string;
  menuItemTextClassName?: string;
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
  checkboxClassName = "",
  wrapperClassName = "",
  menuItemTextClassName = "",
}: CheckboxDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updateDropdownPosition = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setDropdownStyle({
          position: "fixed",
          left: rect.left,
          bottom: window.innerHeight - rect.top + 8,
          top: "auto",
          width: rect.width,
          zIndex: 9999,
        });
      } else {
        setDropdownStyle({
          position: "fixed",
          left: rect.left,
          top: rect.bottom + 8,
          bottom: "auto",
          width: rect.width,
          zIndex: 9999,
        });
      }
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

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

  const dropdown = isOpen
    ? createPortal(
        <div 
          className={`${styles.dropdown} ${dropdownClassName}`} 
          style={dropdownStyle}
          ref={dropdownRef}
        >
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
                    className={checkboxClassName}
                  />
                )}
                {renderOption ? renderOption(opt, selected) : (
                  <span className={[styles.menuItemText, menuItemTextClassName].filter(Boolean).join(" ")}>
                    {opt.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )
    : null;

  return (
    <div className={[styles.wrapper, wrapperClassName].filter(Boolean).join(" ")} ref={containerRef}>
      {renderTrigger(isOpen, setIsOpen)}
      {dropdown}
    </div>
  );
}

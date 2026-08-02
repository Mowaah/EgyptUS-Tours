"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import CheckboxIndicator from "@/components/shared/CheckboxIndicator/CheckboxIndicator";
import styles from "./DashboardField.module.scss";

type DashboardFieldVariant = "default" | "modal";

interface DashboardFieldBaseProps {
  label: ReactNode;
  error?: string;
  endAdornment?: ReactNode;
  variant?: DashboardFieldVariant;
}

interface DashboardFieldInputProps
  extends DashboardFieldBaseProps,
    InputHTMLAttributes<HTMLInputElement> {
  control?: "input";
  options?: never;
}

interface DashboardFieldSelectProps
  extends DashboardFieldBaseProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple"> {
  control: "select";
  options: { label: string; value: string; disabled?: boolean }[];
  multiple?: boolean;
  placeholder?: string;
}

interface DashboardFieldTextareaProps
  extends DashboardFieldBaseProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  control: "textarea";
  options?: never;
}

type DashboardFieldProps = DashboardFieldInputProps | DashboardFieldSelectProps | DashboardFieldTextareaProps;

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.chevronSvg}>
      <path d="m3.5 6 4.5 4 4.5-4" />
    </svg>
  );
}

function ModalSelect({
  id,
  label,
  options,
  errorId,
  endAdornment,
  value,
  defaultValue,
  onChange,
  disabled,
  variant = "default",
  multiple,
  placeholder,
}: {
  id?: string;
  label: ReactNode;
  options?: DashboardFieldSelectProps["options"];
  errorId?: string;
  endAdornment?: ReactNode;
  value?: string | readonly string[] | number;
  defaultValue?: string | readonly string[] | number;
  onChange?: DashboardFieldSelectProps["onChange"];
  disabled?: boolean;
  variant?: "default" | "modal";
  multiple?: boolean;
  placeholder?: string;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const initialValue = value ?? defaultValue ?? (multiple ? [] : "");
  const [internalValue, setInternalValue] = useState<string | readonly string[] | number>(initialValue);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>();
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stringValue = typeof internalValue === "string" ? internalValue : String(internalValue ?? "");
  
  let displayValue: ReactNode = stringValue;
  let isPlaceholder = false;

  if (multiple && Array.isArray(internalValue)) {
    isPlaceholder = internalValue.length === 0;
    if (internalValue.length > 0) {
      const firstValue = internalValue[0];
      const firstLabel = options?.find((o) => o.value === firstValue)?.label || firstValue;
      displayValue = (
        <div className={styles.multiSelectTags}>
          <span className={styles.multiSelectTagText}>{firstLabel}</span>
          {internalValue.length > 1 && (
            <span className={styles.multiSelectTagPill}>+{internalValue.length - 1}</span>
          )}
        </div>
      );
    } else {
      displayValue = options?.find((o) => o.disabled && o.value === "")?.label || placeholder || "";
    }
  } else {
    const selectedOption = options?.find((option) => option.value === stringValue);
    displayValue = (selectedOption?.label ?? stringValue) || placeholder;
    isPlaceholder = !stringValue || selectedOption?.disabled || false;
  }

  const dropdownOptions = options?.filter((option) => !(option.disabled && option.value === ""));

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        ref.current &&
        !ref.current.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const updateDropdownPosition = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const maxDropdownHeight = Math.min(320, Math.max(160, Math.max(spaceBelow, spaceAbove) - 24));
      
      // If less than 200px below, and more space above, open upwards
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropdownStyle({
          left: rect.left,
          bottom: window.innerHeight - rect.top + 8,
          top: "auto",
          width: rect.width,
          maxHeight: maxDropdownHeight,
        });
      } else {
        setDropdownStyle({
          left: rect.left,
          top: rect.bottom + 8,
          bottom: "auto",
          width: rect.width,
          maxHeight: maxDropdownHeight,
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
  }, [open]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentArray = Array.isArray(internalValue) ? internalValue : [];
      const newArray = currentArray.includes(optionValue)
        ? currentArray.filter((v) => v !== optionValue)
        : [...currentArray, optionValue];
      
      if (value === undefined) {
        setInternalValue(newArray);
      }
      
      onChange?.({
        target: { value: newArray },
        currentTarget: { value: newArray },
      } as unknown as ChangeEvent<HTMLSelectElement>);
      
      // Do not close dropdown on multi-select
    } else {
      if (value === undefined) {
        setInternalValue(optionValue);
      }
      onChange?.({
        target: { value: optionValue, name: name },
        currentTarget: { value: optionValue, name: name },
      } as any);
      setOpen(false);
    }
  };

  const dropdown =
    open && dropdownStyle
      ? createPortal(
          <div
            className={styles.modalSelectDropdown}
            style={dropdownStyle}
            role="listbox"
            aria-labelledby={id}
            ref={dropdownRef}
          >
            <div className={styles.modalSelectDropdownItems}>
              {dropdownOptions?.map((option) => {
                const selected = multiple && Array.isArray(internalValue) 
                  ? internalValue.includes(option.value)
                  : option.value === stringValue;

                return (
                  <button
                    key={`${id}-${option.value || option.label}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={option.disabled}
                    className={`${styles.modalSelectDropdownItem} ${
                      selected ? styles.modalSelectDropdownItemSelected : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <div className={styles.modalSelectDropdownItemInner}>
                      <CheckboxIndicator
                        selected={selected}
                        variant="square"
                        size="md"
                        style={{ width: 18, height: 18 }}
                      />
                      <span className={styles.modalSelectOptionText}>{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <label htmlFor={id} className={`${styles.label} ${variant === "modal" ? styles.modalLabel : ""} ${disabled ? styles.labelDisabled : ""}`}>
        {label}
      </label>
      <div className={`${styles.control} ${styles.modalSelectWrap}`} ref={ref}>
        <button
          type="button"
          id={id}
          className={`${styles.input} ${variant === "modal" ? styles.modalInput : ""} ${styles.modalSelectTrigger} ${
            open ? styles.modalSelectTriggerOpen : ""
          } ${errorId ? styles.inputError : ""}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-describedby={errorId}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
        >
          <span
            className={`${styles.modalSelectValue} ${
              isPlaceholder ? styles.modalSelectPlaceholder : ""
            }`}
          >
            {displayValue}
          </span>
        </button>
        {endAdornment ? (
          <div className={styles.endAdornment}>{endAdornment}</div>
        ) : (
          <div className={styles.endAdornment}>
            <ChevronIcon />
          </div>
        )}
      </div>
      {dropdown}
    </>
  );
}

export default function DashboardField({
  label,
  error,
  endAdornment,
  variant = "default",
  className,
  id,
  control = "input",
  options,
  ...props
}: DashboardFieldProps) {
  const maxLength = (props as any).maxLength;
  const initialValueLength = (props as any).value?.toString().length || (props as any).defaultValue?.toString().length || 0;
  const [charCount, setCharCount] = useState(initialValueLength);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCharCount(e.target.value.length);
    if ((props as any).onChange) {
      (props as any).onChange(e);
    }
  };

  const mergedProps = {
    ...props,
    onChange: handleChange,
  };
  const errorId = error && id ? `${id}-error` : undefined;
  const disabled = (props as any).disabled;
  const fieldClassName =
    variant === "modal" ? `${styles.field} ${styles.modalField}` : styles.field;
  const labelClassName = `${
    variant === "modal" ? `${styles.label} ${styles.modalLabel}` : styles.label
  } ${disabled ? styles.labelDisabled : ""}`;
  const inputClassName = `${styles.input} ${
    variant === "modal" ? styles.modalInput : ""
  } ${error ? styles.inputError : ""} ${
    endAdornment ? styles.hasAdornment : ""
  } ${className || ""}`;

  return (
    <div className={fieldClassName}>
      {control === "select" ? (
        <ModalSelect
          id={id}
          label={label}
          options={options}
          errorId={errorId}
          endAdornment={endAdornment}
          variant={variant}
          value={(mergedProps as Omit<DashboardFieldSelectProps, "options">).value}
          defaultValue={(mergedProps as Omit<DashboardFieldSelectProps, "options">).defaultValue}
          disabled={(mergedProps as Omit<DashboardFieldSelectProps, "options">).disabled}
          onChange={(mergedProps as Omit<DashboardFieldSelectProps, "options">).onChange}
          multiple={(mergedProps as Omit<DashboardFieldSelectProps, "options">).multiple}
          placeholder={(mergedProps as Omit<DashboardFieldSelectProps, "options">).placeholder}
          name={(mergedProps as any).name}
        />
      ) : (
        <>
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
          <div className={styles.control}>
            {control === "textarea" ? (
              <textarea
                id={id}
                className={inputClassName}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={errorId}
                {...(mergedProps as DashboardFieldTextareaProps)}
                style={{ borderRadius: "1.5rem", minHeight: "8rem", resize: "vertical", padding: "1rem", ...(props as any).style }}
              />
            ) : (
              <input
                id={id}
                className={inputClassName}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={errorId}
                {...(mergedProps as DashboardFieldInputProps)}
              />
            )}
            {endAdornment ? (
              <div className={styles.endAdornment}>{endAdornment}</div>
            ) : null}
          </div>
          {maxLength && (
            <div className={styles.charCount}>
              {charCount}/{maxLength}
            </div>
          )}
        </>
      )}
      {error ? (
        <div id={errorId} className={styles.errorText} role="alert">
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
}

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
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  control: "select";
  options: { label: string; value: string; disabled?: boolean }[];
}

type DashboardFieldProps = DashboardFieldInputProps | DashboardFieldSelectProps;

function ModalSelect({
  id,
  label,
  options,
  errorId,
  endAdornment,
  value,
  onChange,
  disabled,
}: {
  id?: string;
  label: ReactNode;
  options?: DashboardFieldSelectProps["options"];
  errorId?: string;
  endAdornment?: ReactNode;
  value?: string | readonly string[] | number;
  onChange?: DashboardFieldSelectProps["onChange"];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>();
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stringValue = typeof value === "string" ? value : String(value ?? "");
  const selectedOption = options?.find((option) => option.value === stringValue);
  const displayValue = selectedOption?.label ?? stringValue;
  const isPlaceholder = !stringValue || selectedOption?.disabled;
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
      setDropdownStyle({
        left: rect.left,
        top: rect.bottom + 8,
        width: rect.width,
      });
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
    onChange?.({
      target: { value: optionValue },
      currentTarget: { value: optionValue },
    } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
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
                const selected = option.value === stringValue;

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
      <label htmlFor={id} className={`${styles.label} ${styles.modalLabel}`}>
        {label}
      </label>
      <div className={`${styles.control} ${styles.modalSelectWrap}`} ref={ref}>
        <button
          type="button"
          id={id}
          className={`${styles.input} ${styles.modalInput} ${styles.modalSelectTrigger} ${
            open ? styles.modalSelectTriggerOpen : ""
          }`}
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
        ) : null}
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
  const errorId = error && id ? `${id}-error` : undefined;
  const fieldClassName =
    variant === "modal" ? `${styles.field} ${styles.modalField}` : styles.field;
  const labelClassName =
    variant === "modal" ? `${styles.label} ${styles.modalLabel}` : styles.label;
  const inputClassName = `${styles.input} ${
    variant === "modal" ? styles.modalInput : ""
  } ${error ? styles.inputError : ""} ${
    endAdornment ? styles.hasAdornment : ""
  } ${className || ""}`;

  return (
    <div className={fieldClassName}>
      {control === "select" && variant === "modal" ? (
        <ModalSelect
          id={id}
          label={label}
          options={options}
          errorId={errorId}
          endAdornment={endAdornment}
          value={(props as Omit<DashboardFieldSelectProps, "options">).value}
          disabled={(props as Omit<DashboardFieldSelectProps, "options">).disabled}
          onChange={(props as Omit<DashboardFieldSelectProps, "options">).onChange}
        />
      ) : (
        <>
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
          <div className={styles.control}>
            {control === "select" ? (
          <select
            id={id}
            className={`${inputClassName} ${styles.select}`}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={errorId}
            {...(props as Omit<DashboardFieldSelectProps, "options">)}
          >
            {options?.map((option) => (
              <option
                value={option.value}
                disabled={option.disabled}
                key={`${id}-${option.value || option.label}`}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            className={inputClassName}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={errorId}
            {...(props as DashboardFieldInputProps)}
          />
        )}
            {endAdornment ? (
              <div className={styles.endAdornment}>{endAdornment}</div>
            ) : null}
          </div>
        </>
      )}
      {error ? (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

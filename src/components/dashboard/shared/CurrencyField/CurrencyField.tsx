import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { DASHBOARD_CURRENCY } from "@/constants/currency";
import styles from "./CurrencyField.module.scss";

interface BaseCurrencyFieldProps {
  label: string;
  error?: string;
  suffix?: string;
  id?: string;
  variant?: "default" | "modal";
  placeholder?: string;
}

interface ControlledCurrencyFieldProps extends BaseCurrencyFieldProps {
  value: string;
  onChange: (value: string) => void;
  name?: never;
  control?: never;
}

interface HookFormCurrencyFieldProps<TFieldValues extends FieldValues = FieldValues> extends BaseCurrencyFieldProps {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  value?: never;
  onChange?: never;
}

export type CurrencyFieldProps<TFieldValues extends FieldValues = FieldValues> =
  | ControlledCurrencyFieldProps
  | HookFormCurrencyFieldProps<TFieldValues>;

/** Strip trailing .00 or .0 from decimal strings (e.g. "2100.00" → "2100") */
export function stripTrailingZeros(raw: string): string {
  return raw.replace(/\.00$/, "").replace(/\.0$/, "");
}

/** Format a raw numeric string with thousands commas: "2575" → "2,575", "2100.00" → "2,100" */
export function formatWithCommas(raw: string): string {
  const cleaned = stripTrailingZeros(raw);
  const parts = cleaned.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/** Strip commas so we can parse the numeric value cleanly */
export function stripCommas(value: string): string {
  return value.replace(/,/g, "");
}

interface CurrencyInputInnerProps extends BaseCurrencyFieldProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

function CurrencyInputInner({
  value,
  onChange,
  onBlur,
  label,
  error,
  suffix = DASHBOARD_CURRENCY.symbol,
  id,
  variant,
  placeholder = "0",
}: CurrencyInputInnerProps) {
  const rawNumeric = stripCommas(String(value || "").replace(/[^0-9.,]/g, ""));
  const displayValue = rawNumeric ? formatWithCommas(rawNumeric) : "";

  return (
    <DashboardField
      label={label}
      id={id}
      variant={variant}
      placeholder={placeholder}
      inputMode="numeric"
      type="text"
      value={displayValue}
      onChange={(e) => {
        const raw = stripCommas(e.target.value).replace(/[^0-9.]/g, "");
        onChange(raw.replace(/\.00$/, ""));
      }}
      onBlur={(e) => {
        const raw = stripCommas(e.target.value).replace(/[^0-9.]/g, "");
        const cleaned = raw.replace(/\.00$/, "").replace(/\.0$/, "").replace(/\.$/, "");
        onChange(cleaned);
        if (onBlur) onBlur();
      }}
      endAdornment={
        <span className={styles.currencySymbol}>{suffix}</span>
      }
      error={error}
    />
  );
}

export const CurrencyField = <TFieldValues extends FieldValues = FieldValues>(
  props: CurrencyFieldProps<TFieldValues>
) => {
  if (props.control && props.name) {
    const { name, control, ...rest } = props;
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CurrencyInputInner
            {...rest}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
    );
  }

  const { value = "", onChange = () => {}, ...rest } = props as ControlledCurrencyFieldProps;
  return (
    <CurrencyInputInner
      {...rest}
      value={value}
      onChange={onChange}
    />
  );
};

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./CurrencyField.module.scss";

const NumberSpinnerAdornment = ({ fieldName }: { fieldName: string }) => {
  const { getValues, setValue, setFocus } = useFormContext();

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const rawVal = String(getValues(fieldName) || "").replace(/[^0-9.]/g, "");
    const current = parseFloat(rawVal) || 0;
    setValue(fieldName, (current + 1).toString() + "$", { shouldValidate: true, shouldDirty: true });
    setFocus(fieldName);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const rawVal = String(getValues(fieldName) || "").replace(/[^0-9.]/g, "");
    const current = parseFloat(rawVal) || 0;
    if (current > 0) {
      setValue(fieldName, (current - 1).toString() + "$", { shouldValidate: true, shouldDirty: true });
    }
    setFocus(fieldName);
  };

  return (
    <div className={styles.numberAdornmentContainer}>
      <div className={styles.numberAdornment}>
        <button type="button" onClick={handleIncrement} onMouseDown={(e) => e.preventDefault()}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
        <button type="button" onClick={handleDecrement} onMouseDown={(e) => e.preventDefault()}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export const CurrencyField = ({ name, label, control, error }: { name: any; label: string; control: any; error?: string }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DashboardField
          label={label}
          placeholder="0$"
          inputMode="numeric"
          type="text"
          {...field}
          value={field.value || ""}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, "");
            if (raw) {
              field.onChange(raw + "$");
            } else {
              field.onChange("");
            }
          }}
          endAdornment={<NumberSpinnerAdornment fieldName={name} />}
          error={error}
        />
      )}
    />
  );
};

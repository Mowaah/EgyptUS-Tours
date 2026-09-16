import React from "react";
import Image from "next/image";
import { PhonePrefixSelect } from "@/components/shared";
import { extractDialAndNational, parsePhoneInput } from "@/utils/phoneUtils";

import styles from "./DashboardPhoneField.module.scss";

interface DashboardPhoneFieldProps {
  label: React.ReactNode;
  error?: string;
  variant?: "default" | "modal";
  className?: string;
  id?: string;
  disabled?: boolean;
  
  phoneValue: string;
  prefixValue: string;
  onPhoneChange: (val: string) => void;
  onPrefixChange: (val: string) => void;
}

export default function DashboardPhoneField({
  label,
  error,
  variant = "default",
  className,
  id,
  disabled,
  phoneValue,
  prefixValue,
  onPhoneChange,
  onPrefixChange,
}: DashboardPhoneFieldProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  
  const displayPhone = React.useMemo(() => {
    if (phoneValue && (phoneValue.startsWith("+") || phoneValue.startsWith("00"))) {
      return extractDialAndNational(phoneValue, prefixValue).nationalNumber;
    }
    return phoneValue;
  }, [phoneValue, prefixValue]);

  const fieldClassName =
    variant === "modal" ? `${styles.field} ${styles.modalField}` : styles.field;
    
  const labelClassName = `${
    variant === "modal" ? `${styles.label} ${styles.modalLabel}` : styles.label
  } ${disabled ? styles.labelDisabled : ""}`;

  return (
    <div className={`${fieldClassName} ${className || ""}`}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      
      <div 
        className={`${styles.phoneInputWrapper} ${variant === "modal" ? styles.modalInput : ""}`}
        aria-invalid={error ? "true" : undefined}
      >
        <PhonePrefixSelect 
          phoneValue={prefixValue} 
          onPhoneChange={onPrefixChange} 
          variant="ghost" 
        />
        <input
          id={id}
          type="tel"
          autoComplete="tel"
          className={styles.phoneInput}
          placeholder="000-0000"
          value={displayPhone}
          disabled={disabled}
          aria-describedby={errorId}
          onChange={(e) => {
            const raw = e.target.value;
            const parsed = parsePhoneInput(raw, prefixValue);
            if (parsed.hasCountryCode) {
              onPrefixChange(parsed.dial);
              onPhoneChange(parsed.nationalNumber);
            } else {
              onPhoneChange(parsed.nationalNumber);
            }
          }}
        />
      </div>
      
      {error && (
        <div id={errorId} className={styles.errorText} role="alert">
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import PhonePrefixSelect from "../PhonePrefixSelect/PhonePrefixSelect";
import { extractDialAndNational, parsePhoneInput } from "@/utils/phoneUtils";
import styles from "./PhoneInput.module.scss";
import formStyles from "../FormField/FormField.module.scss";

export interface PhoneInputProps {
  /**
   * The DOM id for the input element
   */
  id?: string;
  /**
   * The name attribute for the input element (defaults to "tel")
   */
  name?: string;
  /**
   * The autoComplete attribute for the input element (defaults to "tel")
   */
  autoComplete?: string;
  /**
   * The full phone number including the country code (e.g. "+1 2039626936")
   */
  value: string;
  /**
   * Called when the phone number changes, passing the full phone number string
   */
  onChange: (val: string) => void;
  /**
   * Optional placeholder for the text input
   */
  placeholder?: string;
  /**
   * Error message to display below the input
   */
  error?: string;
  /**
   * Whether the field has an error (used when error message is displayed by a parent FormField)
   */
  hasError?: boolean;
}

export default function PhoneInput({
  id,
  name = "tel",
  autoComplete = "tel",
  value,
  onChange,
  placeholder = "202-555-0111",
  error,
  hasError,
}: PhoneInputProps) {
  const extracted = extractDialAndNational(value);
  const displayValue = extracted.nationalNumber;
  const isInvalid = !!error || !!hasError;

  return (
    <div className={styles.phoneRow} style={{ alignItems: error ? "flex-start" : undefined }}>
      <PhonePrefixSelect 
        phoneValue={value} 
        onPhoneChange={onChange} 
        error={isInvalid}
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <input
          id={id || "phone-input"}
          name={name}
          autoComplete={autoComplete}
          type="tel"
          className={`${formStyles.input} ${styles.inputPhone} ${isInvalid ? formStyles.inputInvalid : ""}`}
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value;
            const parsed = parsePhoneInput(raw, extracted.dial, extracted.countryCode);
            onChange(parsed.full);
          }}
          placeholder={placeholder}
          style={{ width: "100%" }}
        />
        {error && (
          <div className={formStyles.errorMessage} style={{ marginTop: "4px" }}>
            <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

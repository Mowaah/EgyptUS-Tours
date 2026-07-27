"use client";

import React from "react";
import PhonePrefixSelect from "../PhonePrefixSelect/PhonePrefixSelect";
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
}

export default function PhoneInput({
  id,
  name = "tel",
  autoComplete = "tel",
  value,
  onChange,
  placeholder = "555-0000",
  error,
}: PhoneInputProps) {
  // Extract just the digits for the text input so the prefix isn't duplicated
  const displayValue = value.replace(/^(\+\d+\s*)/, "");

  return (
    <div className={styles.phoneRow} style={{ alignItems: error ? "flex-start" : undefined }}>
      <PhonePrefixSelect 
        phoneValue={value} 
        onPhoneChange={onChange} 
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <input
          id={id || "phone-input"}
          name={name}
          autoComplete={autoComplete}
          type="tel"
          className={`${formStyles.input} ${styles.inputPhone} ${error ? formStyles.inputInvalid : ""}`}
          value={displayValue}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/[^0-9+\-()\s]/g, "");
            if (sanitized.startsWith("+")) {
              // User pasted a full number with country code, replace the whole thing
              onChange(sanitized);
            } else {
              // Extract the current prefix from the full value, or default to +1
              const prefix = value.match(/^(\+\d+\s*)/)?.[1] || "+1 ";
              onChange(prefix + sanitized);
            }
          }}
          placeholder={placeholder}
          style={{ width: "100%" }}
        />
        {error && (
          <div className={formStyles.errorMessage} style={{ marginTop: "4px" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1ZM6.5 8.5H5.5V5.5H6.5V8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D32F2F" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

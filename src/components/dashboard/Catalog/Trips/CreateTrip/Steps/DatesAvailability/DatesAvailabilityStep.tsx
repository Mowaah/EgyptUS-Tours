"use client";

import { useEffect, useRef } from "react";
import { useFormContext, useFieldArray, Controller, useWatch } from "react-hook-form";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import CustomDatePicker from "@/components/shared/CustomDatePicker/CustomDatePicker";
import { ToggleField } from "@/components/dashboard/FormFields";
import { CreateTripValues } from "../../CreateTripSchema";
import styles from "./DatesAvailabilityStep.module.scss";

// ─── Number Spinner ──────────────────────────────────────────────────────────

function NumberSpinner({ fieldName }: { fieldName: string }) {
  const { getValues, setValue, setFocus } = useFormContext();

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const raw = String(getValues(fieldName) || "").replace(/[^0-9]/g, "");
    const current = parseInt(raw) || 0;
    setValue(fieldName, (current + 1).toString(), { shouldValidate: true, shouldDirty: true });
    setFocus(fieldName);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const raw = String(getValues(fieldName) || "").replace(/[^0-9]/g, "");
    const current = parseInt(raw) || 0;
    if (current > 0) {
      setValue(fieldName, (current - 1).toString(), { shouldValidate: true, shouldDirty: true });
    }
    setFocus(fieldName);
  };

  return (
    <div className={styles.spinner}>
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
  );
}

// ─── Dates Availability Step ─────────────────────────────────────────────────

export function DatesAvailabilityStep() {
  const { control, setError, clearErrors, formState: { errors } } = useFormContext<CreateTripValues>();

  const durationStr = useWatch({
    control,
    name: "duration" as any,
  });
  const durationDays = durationStr ? parseInt(durationStr.split('d')[0], 10) || 0 : 0;

  const isEnabled = useWatch({
    control,
    name: "datesAvailability.enabled" as any,
  });

  const { fields: dates, append: appendDate, remove: removeDate } = useFieldArray({
    control,
    name: "datesAvailability.dates" as never,
  });

  useEffect(() => {
    if (isEnabled && dates.length === 0) {
      appendDate({ dateRange: "", spots: "10" } as never);
    }
  }, [isEnabled, dates.length, appendDate]);

  const handleRemoveDate = (index: number) => {
    removeDate(index);
  };

  const rootError = (errors.datesAvailability as any)?.dates?.message || (errors.datesAvailability as any)?.message;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerLeftInner}>
            <div className={styles.headerIcon}>
              <Image
                src="/images/dashboard/catalog/trips/dates.svg"
                alt="Dates"
                width={20}
                height={20}
              />
            </div>
            <h2 className={styles.title}>Dates & Availability</h2>
          </div>
          <Controller
            name={"datesAvailability.enabled" as any}
            control={control}
            render={({ field }) => (
              <ToggleField
                checked={!!field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => appendDate({ dateRange: "", spots: "10" } as never)}
          disabled={!isEnabled}
          aria-label="Add date"
        >
          <Image
            src="/images/dashboard/navbar/add-circle.svg"
            alt="Add"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* Dates Grid / Disabled Notice */}
      {!isEnabled ? (
        <div className={styles.disabledNotice}>
          <Image
            src="/images/dashboard/fields/document-upload.svg"
            alt=""
            width={36}
            height={36}
            style={{ opacity: 0.4 }}
          />
          <p className={styles.disabledTitle}>Fixed Departure Dates Disabled</p>
          <p className={styles.disabledSubtitle}>
            Enable the switch above if this trip offers fixed departure dates and allocated spots.
          </p>
        </div>
      ) : (
        <div className={styles.datesGrid}>
          {dates.map((field, index) => (
            <div key={field.id} className={styles.dateCard} style={{ position: "relative" }}>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleRemoveDate(index)}
                aria-label="Delete date"
                style={{ position: "absolute", right: "16px", top: "16px", zIndex: 10 }}
              >
                <Image src="/images/dashboard/delete.svg" alt="Delete" width={20} height={20} />
              </button>

              <Controller
                name={`datesAvailability.dates.${index}.dateRange` as any}
                control={control}
                render={({ field: f, fieldState }) => (
                  <CustomDatePicker
                    variant="custom"
                    selectsRange={true}
                    fixedDurationDays={durationDays}
                    value={f.value || ""}
                    onChange={f.onChange}
                    placeholder="Select trip date range"
                    renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                        <DashboardField
                          variant="modal"
                          label="Trip date"
                          placeholder="Select trip date range"
                          value={displayTxt || f.value || ""}
                          readOnly
                          error={fieldState.error?.message}
                          endAdornment={<Image src="/images/calendar.svg" alt="Calendar" width={20} height={20} />}
                        />
                      </div>
                    )}
                  />
                )}
              />

              {/* Number of Spots field */}
              <Controller
                name={`datesAvailability.dates.${index}.spots` as any}
                control={control}
                render={({ field: f, fieldState }) => (
                  <DashboardField
                    variant="modal"
                    label="Number of Spots"
                    placeholder="e.g. 3"
                    type="text"
                    value={f.value || ""}
                    onChange={f.onChange}
                    error={fieldState.error?.message}
                    endAdornment={
                      <NumberSpinner fieldName={`datesAvailability.dates.${index}.spots`} />
                    }
                  />
                )}
              />
            </div>
          ))}
        </div>
      )}

      {isEnabled && rootError && (
        <div className={styles.errorText} role="alert">
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{rootError}</span>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import CustomDatePicker from "@/components/shared/CustomDatePicker/CustomDatePicker";
import { ToggleField } from "@/components/dashboard/FormFields";
import { CreateTripValues } from "../../CreateTripSchema";
import styles from "./DatesAvailabilityStep.module.scss";



// ─── Number Spinner (reusing same pattern as Pricing) ───────────────────────

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
  const { control, register } = useFormContext<CreateTripValues>();

  const { fields: dates, append: appendDate, remove: removeDate } = useFieldArray({
    control,
    name: "datesAvailability.dates" as never,
  });

  useEffect(() => {
    if (dates.length === 0) {
      appendDate({ dateRange: "", spots: "" } as never);
      appendDate({ dateRange: "", spots: "" } as never);
      appendDate({ dateRange: "", spots: "" } as never);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          onClick={() => appendDate({ dateRange: "", spots: "" } as never)}
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

      {/* Dates Grid */}
      <div className={styles.datesGrid}>
        {dates.map((field, index) => (
          <div key={field.id} className={styles.dateCard} style={{ position: "relative" }}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => removeDate(index)}
              aria-label="Delete date"
              style={{ position: "absolute", right: "16px", top: "16px", zIndex: 10 }}
            >
              <Image src="/images/dashboard/delete.svg" alt="Delete" width={20} height={20} />
            </button>

            <Controller
              name={`datesAvailability.dates.${index}.dateRange` as any}
              control={control}
              render={({ field: f }) => (
                <CustomDatePicker
                  variant="custom"
                  value={f.value}
                  onChange={f.onChange}
                  renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                    <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                      <DashboardField
                        variant="modal"
                        label="Trip date"
                        placeholder="Select trip date"
                        value={displayTxt || f.value || ""}
                        readOnly
                        endAdornment={<Image src="/images/calendar.svg" alt="Calendar" width={20} height={20} />}
                      />
                    </div>
                  )}
                />
              )}
            />

            {/* Number of Spots field */}
            <DashboardField
              variant="modal"
              label="Number of Spots"
              placeholder="e.g. 3"
              type="text"
              {...register(`datesAvailability.dates.${index}.spots` as any)}
              endAdornment={
                <NumberSpinner fieldName={`datesAvailability.dates.${index}.spots`} />
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

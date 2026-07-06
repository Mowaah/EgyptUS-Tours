import { useEffect } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import CustomDatePicker from "@/components/shared/CustomDatePicker/CustomDatePicker";
import { CreateTripValues } from "../../CreateTripSchema";
import styles from "./PricingStep.module.scss";

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

const CurrencyField = ({ name, label, control }: { name: any; label: string; control: any }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DashboardField
          variant="modal"
          label={label}
          placeholder="0.0$"
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
        />
      )}
    />
  );
};

const CalendarAdornment = () => (
  <div className={styles.calendarAdornment}>
    <Image src="/images/calendar-gray.svg" alt="Calendar" width={20} height={20} />
  </div>
);

export function PricingStep() {
  const { control } = useFormContext<CreateTripValues>();

  const {
    fields: privateSeasons,
    append: appendPrivateSeason,
  } = useFieldArray({
    control,
    name: "pricing.privateTour.seasons" as never,
  });

  const {
    fields: groupSeasons,
    append: appendGroupSeason,
  } = useFieldArray({
    control,
    name: "pricing.groupTour.seasons" as never,
  });

  const handleAddNewSeason = () => {
    // Adds a new season to both private and group tours for convenience
    appendPrivateSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" });
    appendGroupSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" });
  };

  // Pre-fill with two empty seasons if empty
  useEffect(() => {
    if (privateSeasons.length === 0) {
      appendPrivateSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" });
      appendPrivateSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" });
    }
    if (groupSeasons.length === 0) {
      appendGroupSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" });
      appendGroupSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.pricingContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="Pricing" width={20} height={20} />
          </div>
          <h2 className={styles.title}>General Pricing</h2>
        </div>
        <button type="button" onClick={handleAddNewSeason} className={styles.addButton}>
          <Image src="/images/dashboard/navbar/add-circle.svg" alt="Add" width={24} height={24} />
        </button>
      </div>

      {/* Private Tour Section */}
      <div className={styles.tourSection}>
        <div className={styles.basePriceWrapper}>
          <CurrencyField
            label="Private Tour (Per person)"
            name="pricing.privateTour.basePrice"
            control={control}
          />
        </div>
        <div className={styles.seasonsGrid}>
          {privateSeasons.map((field, index) => (
            <div key={field.id} className={styles.seasonCard}>
              <div className={styles.fieldWrapper}>
                <Controller
                  control={control}
                  name={`pricing.privateTour.seasons.${index}.dateRange` as const}
                  render={({ field }) => (
                    <CustomDatePicker
                      variant="custom"
                      value={field.value || ""}
                      onChange={field.onChange}
                      renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                        <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                          <DashboardField
                            variant="modal"
                            label="Select trip date"
                            value={displayTxt || field.value || ""}
                            readOnly
                            placeholder="Select date"
                            endAdornment={<CalendarAdornment />}
                          />
                        </div>
                      )}
                    />
                  )}
                />
              </div>
              <div className={styles.roomsContainer}>
                <div className={styles.fieldWrapper}>
                  <CurrencyField
                    label="Single Room per person"
                    name={`pricing.privateTour.seasons.${index}.singleRoom`}
                    control={control}
                  />
                </div>
                <div className={styles.fieldWrapper}>
                  <CurrencyField
                    label="Double Room per person"
                    name={`pricing.privateTour.seasons.${index}.doubleRoom`}
                    control={control}
                  />
                </div>
                <div className={styles.fieldWrapper}>
                  <CurrencyField
                    label="Triple Room per person"
                    name={`pricing.privateTour.seasons.${index}.tripleRoom`}
                    control={control}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Tour Section */}
      <div className={styles.tourSection}>
        <div className={styles.basePriceWrapper}>
          <CurrencyField
            label="Group Tour (Per person)"
            name="pricing.groupTour.basePrice"
            control={control}
          />
        </div>
        <div className={styles.seasonsGrid}>
          {groupSeasons.map((field, index) => (
            <div key={field.id} className={styles.seasonCard}>
              <div className={styles.fieldWrapper}>
                <Controller
                  control={control}
                  name={`pricing.groupTour.seasons.${index}.dateRange` as const}
                  render={({ field }) => (
                    <CustomDatePicker
                      variant="custom"
                      value={field.value || ""}
                      onChange={field.onChange}
                      renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                        <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                          <DashboardField
                            variant="modal"
                            label="Select trip date"
                            value={displayTxt || field.value || ""}
                            readOnly
                            placeholder="Select date"
                            endAdornment={<CalendarAdornment />}
                          />
                        </div>
                      )}
                    />
                  )}
                />
              </div>
              <div className={styles.roomsContainer}>
                <div className={styles.fieldWrapper}>
                  <CurrencyField
                    label="Single Room per person"
                    name={`pricing.groupTour.seasons.${index}.singleRoom`}
                    control={control}
                  />
                </div>
                <div className={styles.fieldWrapper}>
                  <CurrencyField
                    label="Double Room per person"
                    name={`pricing.groupTour.seasons.${index}.doubleRoom`}
                    control={control}
                  />
                </div>
                <div className={styles.fieldWrapper}>
                  <CurrencyField
                    label="Triple Room per person"
                    name={`pricing.groupTour.seasons.${index}.tripleRoom`}
                    control={control}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

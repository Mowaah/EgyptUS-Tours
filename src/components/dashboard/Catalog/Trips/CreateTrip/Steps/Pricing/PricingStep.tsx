import { useEffect } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import CustomDatePicker from "@/components/shared/CustomDatePicker/CustomDatePicker";
import { CreateTripValues } from "../../CreateTripSchema";
import { CurrencyField } from "@/components/dashboard/shared";
import styles from "./PricingStep.module.scss";



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

  // No global handleAddNewSeason needed

  // Seasons are now initialized in CreateTrip.tsx defaultValues

  return (
    <div className={styles.pricingContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="Pricing" width={20} height={20} />
          </div>
          <h2 className={styles.title}>General Pricing</h2>
        </div>
      </div>

      {/* Private Tour Section */}
      <div className={styles.tourSection}>
        <div className={styles.basePriceWrapper}>
          <div className={styles.basePriceField}>
            <CurrencyField
              label="Private Tour (Per person)"
              name="pricing.privateTour.basePrice"
              control={control}
            />
          </div>
          <button 
            type="button" 
            onClick={() => appendPrivateSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" })} 
            className={styles.addSeasonButton}
          >
            <Image src="/images/dashboard/navbar/add-circle.svg" alt="Add" width={24} height={24} />
          </button>
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
                      selectsRange={true}
                      value={field.value || ""}
                      onChange={field.onChange}
                      renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                        <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                          <DashboardField
                            variant="modal"
                            label="Select trip date"
                            value={displayTxt || field.value || ""}
                            readOnly
                            placeholder="e.g. May - Sep"
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
          <div className={styles.basePriceField}>
            <CurrencyField
              label="Group Tour (Per person)"
              name="pricing.groupTour.basePrice"
              control={control}
            />
          </div>
          <button 
            type="button" 
            onClick={() => appendGroupSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" })} 
            className={styles.addSeasonButton}
          >
            <Image src="/images/dashboard/navbar/add-circle.svg" alt="Add" width={24} height={24} />
          </button>
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
                      selectsRange={true}
                      value={field.value || ""}
                      onChange={field.onChange}
                      renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                        <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                          <DashboardField
                            variant="modal"
                            label="Select trip date"
                            value={displayTxt || field.value || ""}
                            readOnly
                            placeholder="e.g. May - Sep"
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

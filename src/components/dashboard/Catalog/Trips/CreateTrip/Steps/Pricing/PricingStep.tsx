import { useEffect, useRef } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { CreateTripValues } from "../../CreateTripSchema";
import { CurrencyField } from "@/components/dashboard/shared";
import styles from "./PricingStep.module.scss";

export function PricingStep() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { control, watch, formState: { errors } } = useFormContext<CreateTripValues>();

  const tourTypes = watch("tourTypes") || [];
  // Default to showing both if tourTypes is not set yet
  const showPrivate = tourTypes.length === 0 || tourTypes.includes("private-tour");
  const showGroup = tourTypes.length === 0 || tourTypes.includes("group-tour");

  const rawPricingError = errors.pricing as {
    root?: { message?: string };
    message?: string;
    privateTour?: { message?: string; basePrice?: { message?: string } };
    groupTour?: { message?: string; basePrice?: { message?: string } };
  } | undefined;

  const pricingErrorMessage =
    rawPricingError?.root?.message ||
    rawPricingError?.message ||
    rawPricingError?.privateTour?.message ||
    rawPricingError?.privateTour?.basePrice?.message ||
    rawPricingError?.groupTour?.message ||
    rawPricingError?.groupTour?.basePrice?.message;

  useEffect(() => {
    if (pricingErrorMessage && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pricingErrorMessage]);

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

  return (
    <div className={styles.pricingContainer} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="Pricing" width={20} height={20} />
          </div>
          <h2 className={styles.title}>General Pricing</h2>
        </div>
      </div>



      {/* Private Tour Section */}
      {showPrivate && (
        <div className={styles.tourSection}>
          <div className={styles.basePriceWrapper}>
            <h3 className={styles.title}>Private Tour Pricing</h3>
            <button 
              type="button" 
              onClick={() => appendPrivateSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" })} 
              className={styles.addSeasonButton}
            >
              <Image src="/images/dashboard/navbar/add-circle.svg" alt="Add" width={24} height={24} />
              <span style={{marginLeft: 8, fontSize: 14}}>Add Season</span>
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
                      <DashboardField
                        label="Season Label / Date Range"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="e.g. Christmas - New Year"
                        readOnly={index < 2}
                      />
                    )}
                  />
                </div>
                <div className={styles.roomsContainer}>
                  <div className={styles.fieldWrapper}>
                    <CurrencyField
                      label="Single Room per night"
                      name={`pricing.privateTour.seasons.${index}.singleRoom`}
                      control={control}
                    />
                  </div>
                  <div className={styles.fieldWrapper}>
                    <CurrencyField
                      label="Double Room per night"
                      name={`pricing.privateTour.seasons.${index}.doubleRoom`}
                      control={control}
                    />
                  </div>
                  <div className={styles.fieldWrapper}>
                    <CurrencyField
                      label="Triple Room per night"
                      name={`pricing.privateTour.seasons.${index}.tripleRoom`}
                      control={control}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Tour Section */}
      {showGroup && (
        <div className={styles.tourSection}>
          <div className={styles.basePriceWrapper}>
            <h3 className={styles.title}>Group Tour Pricing</h3>
            <button 
              type="button" 
              onClick={() => appendGroupSeason({ dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" })} 
              className={styles.addSeasonButton}
            >
              <Image src="/images/dashboard/navbar/add-circle.svg" alt="Add" width={24} height={24} />
              <span style={{marginLeft: 8, fontSize: 14}}>Add Season</span>
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
                      <DashboardField
                        label="Season Label / Date Range"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="e.g. Christmas - New Year"
                        readOnly={index < 2}
                      />
                    )}
                  />
                </div>
                <div className={styles.roomsContainer}>
                  <div className={styles.fieldWrapper}>
                    <CurrencyField
                      label="Single Room per night"
                      name={`pricing.groupTour.seasons.${index}.singleRoom`}
                      control={control}
                    />
                  </div>
                  <div className={styles.fieldWrapper}>
                    <CurrencyField
                      label="Double Room per night"
                      name={`pricing.groupTour.seasons.${index}.doubleRoom`}
                      control={control}
                    />
                  </div>
                  <div className={styles.fieldWrapper}>
                    <CurrencyField
                      label="Triple Room per night"
                      name={`pricing.groupTour.seasons.${index}.tripleRoom`}
                      control={control}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Rooms Section */}
      <div className={styles.tourSection}>
        <div className={styles.basePriceWrapper}>
          <h3 className={styles.title}>Additional Rooms Surcharge (Per Night)</h3>
        </div>
        <div className={styles.seasonsGrid}>
          <div className={styles.seasonCard}>
            <div className={styles.roomsContainer}>
              <div className={styles.fieldWrapper}>
                <CurrencyField
                  label="Sea View"
                  name="pricing.additionalRooms.seaView"
                  control={control}
                />
              </div>
              <div className={styles.fieldWrapper}>
                <CurrencyField
                  label="Pool View"
                  name="pricing.additionalRooms.poolView"
                  control={control}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {pricingErrorMessage && (
        <div className={styles.errorText} role="alert">
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{pricingErrorMessage}</span>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { CreateTripValues } from "../../CreateTripSchema";
import { CurrencyField } from "@/components/dashboard/shared";
import styles from "./PricingStep.module.scss";

interface PricingStepProps {
  isDayTour?: boolean;
}

export function PricingStep({ isDayTour: isDayTourProp }: PricingStepProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { control, watch, formState: { errors } } = useFormContext<CreateTripValues>();
  const categoryValue = watch("category");
  const isDayTour = isDayTourProp ?? (
    typeof categoryValue === "string" && (
      categoryValue.toLowerCase().includes("day") ||
      (watch("pricing.privateTour.seasons") || []).some((s) => s.solo || s.pax2_4 || s.pax5_8 || s.pax9_20)
    )
  );

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
    remove: removePrivateSeason,
  } = useFieldArray({
    control,
    name: "pricing.privateTour.seasons" as never,
  });

  const {
    fields: groupSeasons,
    append: appendGroupSeason,
    remove: removeGroupSeason,
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
            <h3 className={styles.title}>{isDayTour ? "Private Tour" : "Private Tour Pricing"}</h3>
            {privateSeasons.length < 3 && (
              <button
                type="button"
                onClick={() => appendPrivateSeason({
                  dateRange: isDayTour ? "Christmas - New Year" : "Christmas & New Year",
                  singleRoom: "",
                  doubleRoom: "",
                  tripleRoom: "",
                  solo: "",
                  pax2_4: "",
                  pax5_8: "",
                  pax9_20: "",
                })}
                className={styles.addSeasonButton}
              >
                <Image src="/images/dashboard/navbar/add-circle.svg" alt="Add" width={24} height={24} />
                <span style={{marginLeft: 8, fontSize: 14}}>Add Season</span>
              </button>
            )}
          </div>
          <div className={styles.seasonsGrid}>
            {privateSeasons.map((field, index) => {
              const isChristmas = index === 2;
              const christmasLabel = isDayTour ? "Christmas - New Year" : "Christmas & New Year";
              return (
                <div key={field.id} className={styles.seasonCard}>
                  <div className={styles.fieldWrapper}>
                    <Controller
                      control={control}
                      name={`pricing.privateTour.seasons.${index}.dateRange` as const}
                      render={({ field }) => (
                        <DashboardField
                          label={isDayTour ? "Trip date" : "Season Label / Date Range"}
                          value={isChristmas ? christmasLabel : (field.value || "")}
                          onChange={field.onChange}
                          placeholder={index === 0 ? "May - Sep" : index === 1 ? "Oct - Apr" : christmasLabel}
                          readOnly={index < 2 || isChristmas}
                          endAdornment={isChristmas ? (
                            <button
                              type="button"
                              onClick={() => removePrivateSeason(index)}
                              className={styles.deleteButton}
                              title="Remove Season"
                            >
                              <Image src="/images/dashboard/delete.svg" alt="Delete" width={18} height={18} />
                            </button>
                          ) : (
                            <div className={styles.calendarAdornment}>
                              <Image src="/images/calendar3.svg" alt="" width={18} height={18} />
                            </div>
                          )}
                        />
                      )}
                    />
                  </div>
                  {isDayTour ? (
                    <div className={styles.roomsContainer}>
                      <div className={styles.fieldWrapper}>
                        <CurrencyField
                          label="Solo"
                          name={`pricing.privateTour.seasons.${index}.solo`}
                          control={control}
                        />
                      </div>
                      <div className={styles.fieldWrapper}>
                        <CurrencyField
                          label="2-4 Pax"
                          name={`pricing.privateTour.seasons.${index}.pax2_4`}
                          control={control}
                        />
                      </div>
                      <div className={styles.fieldWrapper}>
                        <CurrencyField
                          label="5-8 Pax"
                          name={`pricing.privateTour.seasons.${index}.pax5_8`}
                          control={control}
                        />
                      </div>
                      <div className={styles.fieldWrapper}>
                        <CurrencyField
                          label="9-20 Pax"
                          name={`pricing.privateTour.seasons.${index}.pax9_20`}
                          control={control}
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Group Tour Section */}
      {showGroup && (
        <div className={styles.tourSection}>
          <div className={styles.basePriceWrapper}>
            <h3 className={styles.title}>{isDayTour ? "Group Tour" : "Group Tour Pricing"}</h3>
            {groupSeasons.length < 3 && (
              <button
                type="button"
                onClick={() => appendGroupSeason({
                  dateRange: isDayTour ? "Christmas - New Year" : "Christmas & New Year",
                  singleRoom: "",
                  doubleRoom: "",
                  tripleRoom: "",
                  solo: "",
                  pax2_4: "",
                  pax5_8: "",
                  pax9_20: "",
                })}
                className={styles.addSeasonButton}
              >
                <Image src="/images/dashboard/navbar/add-circle.svg" alt="Add" width={24} height={24} />
                <span style={{marginLeft: 8, fontSize: 14}}>Add Season</span>
              </button>
            )}
          </div>
          <div className={styles.seasonsGrid}>
            {groupSeasons.map((field, index) => {
              const isChristmas = index === 2;
              const christmasLabel = isDayTour ? "Christmas - New Year" : "Christmas & New Year";
              return (
                <div key={field.id} className={styles.seasonCard}>
                  <div className={styles.fieldWrapper}>
                    <Controller
                      control={control}
                      name={`pricing.groupTour.seasons.${index}.dateRange` as const}
                      render={({ field }) => (
                        <DashboardField
                          label={isDayTour ? "Trip date" : "Season Label / Date Range"}
                          value={isChristmas ? christmasLabel : (field.value || "")}
                          onChange={field.onChange}
                          placeholder={index === 0 ? "May - Sep" : index === 1 ? "Oct - Apr" : christmasLabel}
                          readOnly={index < 2 || isChristmas}
                          endAdornment={isChristmas ? (
                            <button
                              type="button"
                              onClick={() => removeGroupSeason(index)}
                              className={styles.deleteButton}
                              title="Remove Season"
                            >
                              <Image src="/images/dashboard/delete.svg" alt="Delete" width={18} height={18} />
                            </button>
                          ) : (
                            <div className={styles.calendarAdornment}>
                              <Image src="/images/calendar3.svg" alt="" width={18} height={18} />
                            </div>
                          )}
                        />
                      )}
                    />
                  </div>
                  {isDayTour ? (
                    <div className={styles.roomsContainer}>
                      <div className={styles.fieldWrapper}>
                        <CurrencyField
                          label="Solo"
                          name={`pricing.groupTour.seasons.${index}.solo`}
                          control={control}
                        />
                      </div>
                      <div className={styles.fieldWrapper}>
                        <CurrencyField
                          label="2-4 Pax"
                          name={`pricing.groupTour.seasons.${index}.pax2_4`}
                          control={control}
                        />
                      </div>
                      <div className={styles.fieldWrapper}>
                        <CurrencyField
                          label="5-8 Pax"
                          name={`pricing.groupTour.seasons.${index}.pax5_8`}
                          control={control}
                        />
                      </div>
                      <div className={styles.fieldWrapper}>
                        <CurrencyField
                          label="9-20 Pax"
                          name={`pricing.groupTour.seasons.${index}.pax9_20`}
                          control={control}
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional Rooms Section - Only for standard trips with hotel rooms */}
      {!isDayTour && (
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
      )}

      {pricingErrorMessage && (
        <div className={styles.errorText} role="alert">
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{pricingErrorMessage}</span>
        </div>
      )}
    </div>
  );
}

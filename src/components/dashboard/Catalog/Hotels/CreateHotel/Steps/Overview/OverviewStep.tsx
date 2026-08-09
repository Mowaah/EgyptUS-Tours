import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection, FormSpec } from "@/components/dashboard/FormFields";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { CreateHotelValues } from "../../CreateHotelSchema";
import dashboardStyles from "../../CreateHotel.module.scss";
import styles from "./OverviewStep.module.scss";

export function OverviewStep() {
  const [basicLang, setBasicLang] = useState<Language>("English");
  const [contentLang, setContentLang] = useState<Language>("English");
  const [facilitiesLang, setFacilitiesLang] = useState<Language>("English");
  const [facilityInput, setFacilityInput] = useState("");
  
  const { register, watch, setValue, control, formState: { errors } } = useFormContext<CreateHotelValues>();
  const facilities = watch("facilities") || [];

  const handleAddFacility = () => {
    const trimmed = facilityInput.trim();
    if (trimmed && !facilities.includes(trimmed)) {
      setValue("facilities", [...facilities, trimmed]);
      setFacilityInput("");
    }
  };

  const handleRemoveFacility = (tag: string) => {
    setValue("facilities", facilities.filter((t) => t !== tag));
  };

  return (
    <div className={dashboardStyles.columnsContainer}>
      <div className={dashboardStyles.leftColumn}>
        <FormSection 
          title="Basic Information" 
          iconSrc="/images/dashboard/catalog/hotels/basic.svg"
          className={styles.card}
        >
          <FormSpec>
            <LanguageTabs active={basicLang} onChange={setBasicLang} className={styles.whiteTabs} />
            <div className={styles.inputRow}>
              <DashboardField 
                label="Hotel Name" 
                placeholder="Enter hotel name" 
                error={errors.hotelName?.message}
                {...register("hotelName")} 
              />
              <Controller
                name="totalRooms"
                control={control}
                render={({ field, fieldState }) => (
                <DashboardField 
                  {...field}
                  label="Total Rooms" 
                  placeholder="Enter total rooms (e.g. 250)" 
                  control="input"
                  type="number"
                  error={fieldState.error?.message}
                />
              )}
              />
            </div>
            
            <DashboardField 
              label="Subtitle" 
              placeholder="Enter subtitle" 
              error={errors.subtitle?.message}
              {...register("subtitle")} 
            />

            <Controller
              name="cityLocation"
              control={control}
              render={({ field, fieldState }) => (
                <DashboardField 
                  {...field}
                  label="City / Location" 
                  placeholder="Enter city or location" 
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <DashboardField 
                  {...field}
                  label="Address" 
                  placeholder="Enter address (e.g. 123 Main St, Luxor)" 
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="starRating"
              control={control}
              render={({ field, fieldState }) => (
                <DashboardField 
                  {...field}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val > 5) e.target.value = "5";
                    if (val < 0) e.target.value = "0";
                    field.onChange(e);
                  }}
                  label="Star Rating" 
                  placeholder="Enter rating (0 - 5)" 
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormSpec>
        </FormSection>

        <FormSection 
          title="Facilities" 
          iconSrc="/images/dashboard/catalog/hotels/facilities.svg"
          className={styles.card}
        >
          <FormSpec>
            <LanguageTabs active={facilitiesLang} onChange={setFacilitiesLang} className={styles.whiteTabs} />
            
            <div className={styles.inputGroup}>
              <div className={styles.facilityInputWrapper}>
                <input
                  type="text"
                  placeholder="Enter facility"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFacility();
                    }
                  }}
                />
                <button 
                  type="button" 
                  className={styles.addBtn} 
                  onClick={handleAddFacility}
                  disabled={!facilityInput.trim()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {facilities.length > 0 && (
                <div className={styles.facilitiesTags}>
                  {facilities.map((fac) => (
                    <div key={fac} className={styles.facilityTag}>
                      <span>{fac}</span>
                      <button type="button" onClick={() => handleRemoveFacility(fac)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.17 14.83L14.83 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.83 14.83L9.17 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSpec>
        </FormSection>
      </div>

      <div className={dashboardStyles.rightColumn}>
        <FormSection 
          title="Hotel Content" 
          iconSrc="/images/dashboard/catalog/hotels/hotel_content.svg"
          className={styles.card}
        >
          <FormSpec>
            <LanguageTabs active={contentLang} onChange={setContentLang} className={styles.whiteTabs} />
            <DashboardField 
              label="Description" 
              control="textarea"
              placeholder="Description"
              error={errors.description?.message}
              {...register("description")}
            />
            <DashboardField 
              label="Second Description" 
              control="textarea"
              placeholder="Description"
              error={errors.secondDescription?.message}
              {...register("secondDescription")}
            />
          </FormSpec>
        </FormSection>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useFormContext, useFieldArray, Controller, useWatch } from "react-hook-form";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { CurrencyField } from "@/components/dashboard/shared";
import { MultiUploadDropzone } from "@/components/dashboard/FormFields";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import { CreateHotelValues } from "../../CreateHotelSchema";
import styles from "./RoomsStep.module.scss";
import Image from "next/image";

function RoomPreview({ index }: { index: number }) {
  const { control } = useFormContext<CreateHotelValues>();
  const roomType = useWatch({ control, name: `rooms.${index}.type` });
  const view = useWatch({ control, name: `rooms.${index}.view` });

  const text = [roomType, view].filter(Boolean).join(" - ");

  if (!roomType && !view) return null;

  return (
    <div className={styles.previewSection}>
      <div className={styles.previewInner}>
        <span className={styles.previewLabel}>Room Preview</span>
        <span className={styles.previewText}>{text}</span>
      </div>
    </div>
  );
}

function FacilitiesSelector({ value = [], onChange }: { value: string[]; onChange: (val: string[]) => void }) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeFacility = (valToRemove: string) => {
    onChange(value.filter(v => v !== valToRemove));
  };

  return (
    <div className={styles.facilitiesContainer}>
      <div className={styles.facilityInputRow}>
        <input 
          type="text" 
          className={styles.facilityInputField} 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bathrobe & Slippers"
        />
        <button 
          type="button" 
          className={styles.iconBtnAdd} 
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {value.length > 0 && (
        <div className={styles.standardFacilitiesBox}>
          {value.map((facility, idx) => (
            <div key={idx} className={styles.stdFacilityActive}>
              <button type="button" className={styles.stdFacilityRemoveBtn} onClick={() => removeFacility(facility)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="#2971E6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 6L6 10" stroke="#2971E6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L10 10" stroke="#2971E6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className={styles.stdFacilityText}>{facility}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RoomsStep() {
  const [roomsLang, setRoomsLang] = useState<Language>("English");
  const { control, register, formState: { errors } } = useFormContext<CreateHotelValues>();
  
  const rawRoomsError = errors.rooms as { root?: { message?: string }; message?: string } | undefined;
  const roomsErrorMessage = rawRoomsError?.root?.message || rawRoomsError?.message;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const handleAddRoom = () => {
    append({
      category: "",
      type: "",
      view: "",
      pricePerNight: "",
      description: { en: "", it: "", es: "" },
      facilities: [],
      photos: [],
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.titleLeft}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/hotels/basic.svg" alt="" width={20} height={20} />
          </div>
          <h2 className={styles.titleText}>Rooms</h2>
        </div>
        <button type="button" className={styles.iconBtnAdd} onClick={handleAddRoom}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {roomsErrorMessage && (
        <div className={styles.errorText} role="alert">
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{roomsErrorMessage}</span>
        </div>
      )}

      <div style={{ padding: "0 24px", marginBottom: "16px" }}>
        <LanguageTabs active={roomsLang} onChange={setRoomsLang} />
      </div>

      <div className={styles.roomsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.roomCard}>
            <div className={styles.roomHeader}>
              <div className={styles.roomTitleWrap}>
                <h3 className={styles.roomTitle}>Room {index + 1}</h3>
              </div>
              <button type="button" className={styles.deleteBtn} onClick={() => remove(index)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 5H4.16667H17.5" stroke="#D80027" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.66667 5.00001V3.33334C6.66667 2.89131 6.84226 2.46739 7.15482 2.15483C7.46738 1.84227 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84227 12.8452 2.15483C13.1577 2.46739 13.3333 2.89131 13.3333 3.33334V5.00001M15.8333 5.00001V16.6667C15.8333 17.1087 15.6577 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83333C5.39131 18.3333 4.96738 18.1577 4.65482 17.8452C4.34226 17.5326 4.16667 17.1087 4.16667 16.6667V5.00001H15.8333Z" stroke="#D80027" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.33333 9.16667V14.1667" stroke="#D80027" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.6667 9.16667V14.1667" stroke="#D80027" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className={styles.formFieldsArea}>
              <div className={styles.rowGroup}>
                <div className={styles.row}>
                  <div className={styles.fieldItem}>
                    <Controller
                      name={`rooms.${index}.category`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <DashboardField
                          {...field}
                          control="select"
                          options={[
                            { label: "Standard Room", value: "Standard Room" },
                            { label: "Deluxe Room", value: "Deluxe Room" },
                            { label: "Premium Room", value: "Premium Room" },
                            { label: "Suite", value: "Suite" },
                          ]}
                          label="Room Category"
                          placeholder="e.g. Standard Room"
                          error={(errors?.rooms?.[index] as any)?.category?.message || fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                  <div className={styles.fieldItem}>
                    <Controller
                      name={`rooms.${index}.type`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <DashboardField
                          {...field}
                          control="select"
                          options={[
                            { label: "Single", value: "Single" },
                            { label: "Double Room", value: "Double Room" },
                            { label: "Triple Room", value: "Triple Room" },
                          ]}
                          label="Room Type"
                          placeholder="e.g. Single"
                          error={(errors?.rooms?.[index] as any)?.type?.message || fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                </div>
                
                <div className={styles.row}>
                  <div className={styles.fieldItem}>
                    <Controller
                      name={`rooms.${index}.view`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <DashboardField
                          {...field}
                          control="select"
                          options={[
                            { label: "Sea View", value: "Sea View" },
                            { label: "Pool View", value: "Pool View" },
                            { label: "Garden View", value: "Garden View" },
                          ]}
                          label="Room View"
                          placeholder="e.g. Garden View"
                          error={(errors?.rooms?.[index] as any)?.view?.message || fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                  <div className={styles.fieldItem}>
                    <Controller
                      name={`rooms.${index}.pricePerNight`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <CurrencyField 
                          name={`rooms.${index}.pricePerNight`}
                          label="Price per Night ($)"
                          control={control}
                          error={(errors?.rooms?.[index] as any)?.pricePerNight?.message || fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.fieldItem} style={{ width: '100%' }}>
                    <Controller
                      name={`rooms.${index}.description.${getLangKey(roomsLang)}` as const}
                      control={control}
                      render={({ field, fieldState }) => (
                        <DashboardField 
                          {...field}
                          label={`Room Description (${roomsLang})`}
                          placeholder="Spacious deluxe room featuring panoramic views..."
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className={styles.facilitiesField}>
                  <Controller
                    name={`rooms.${index}.facilities`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <div className={styles.facilitiesHeader}>
                          <p className={styles.facilitiesLabel}>Facilities</p>
                        </div>
                        <FacilitiesSelector value={value || []} onChange={onChange} />
                      </>
                    )}
                  />
                </div>

                <div className={styles.photoSection}>
                  <p className={styles.photoLabel}>Room Photo ( 327 x 174 )</p>
                  <Controller
                    name={`rooms.${index}.photos`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <MultiUploadDropzone 
                        values={value} 
                        onFilesChange={onChange} 
                        title="Click to upload an image or drag & drop"
                        subtitle="PNG, JPG, GIF up to 10MB"
                      />
                    )}
                  />
                </div>

                <RoomPreview index={index} />
              </div>
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
            No rooms added yet. Click "+ Add" to create a room.
          </div>
        )}
      </div>
    </div>
  );
}

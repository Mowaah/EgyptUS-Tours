import { useFormContext, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { CreateTripValues } from "../../CreateTripSchema";
import styles from "./InclusionsStep.module.scss";

export function InclusionsStep() {
  const [includedLang, setIncludedLang] = useState<Language>("English");
  const [excludedLang, setExcludedLang] = useState<Language>("English");

  const { control } = useFormContext<CreateTripValues>();

  const {
    fields: inclusionFields,
    append: appendInclusion,
    remove: removeInclusion,
  } = useFieldArray({
    control,
    name: "inclusions" as never, // cast to never since the type might be strict
  });

  const {
    fields: exclusionFields,
    append: appendExclusion,
    remove: removeExclusion,
  } = useFieldArray({
    control,
    name: "exclusions" as never,
  });

  return (
    <div className={styles.inclusionsContainer}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Image src="/images/dashboard/catalog/trips/inclusions.svg" alt="Inclusions" width={20} height={20} />
        </div>
        <h2>Inclusions</h2>
      </div>

      <div className={styles.columnsWrapper}>
        {/* Included Column */}
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.iconIncluded}>
              {/* check icon */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L4.5 8.5L2 6" stroke="#2971E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Included</h3>
          </div>

          <LanguageTabs active={includedLang} onChange={setIncludedLang} variant="white" className={styles.tabsMargin} />

          <div className={styles.fieldsList}>
            {inclusionFields.map((field, index) => (
              <div key={field.id} style={{ width: '100%' }}>
                <DashboardField
                  variant="modal"
                  label={null}
                  placeholder="Enter inclusion..."
                  {...control.register(`inclusions.${index}` as const)}
                  endAdornment={
                    <button type="button" onClick={() => removeInclusion(index)} className={styles.deleteButton}>
                      <Image src="/images/dashboard/delete.svg" alt="Delete" width={18} height={18} />
                    </button>
                  }
                />
              </div>
            ))}
          </div>

          <button type="button" onClick={() => appendInclusion("")} className={styles.addButton}>
            Add <Image src="/images/dashboard/add-circle-blue.svg" alt="Add" width={24} height={24} />
          </button>
        </div>

        {/* Not Included Column */}
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.iconExcluded}>
              {/* cross icon */}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L9 9M9 1L1 9" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Not- Included</h3>
          </div>

          <LanguageTabs active={excludedLang} onChange={setExcludedLang} variant="white" className={styles.tabsMargin} />

          <div className={styles.fieldsList}>
            {exclusionFields.map((field, index) => (
              <div key={field.id} style={{ width: '100%' }}>
                <DashboardField
                  variant="modal"
                  label={null}
                  placeholder="Enter exclusion..."
                  {...control.register(`exclusions.${index}` as const)}
                  endAdornment={
                    <button type="button" onClick={() => removeExclusion(index)} className={styles.deleteButton}>
                      <Image src="/images/dashboard/delete.svg" alt="Delete" width={18} height={18} />
                    </button>
                  }
                />
              </div>
            ))}
          </div>

          <button type="button" onClick={() => appendExclusion("")} className={styles.addButton}>
            Add <Image src="/images/dashboard/add-circle-blue.svg" alt="Add" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

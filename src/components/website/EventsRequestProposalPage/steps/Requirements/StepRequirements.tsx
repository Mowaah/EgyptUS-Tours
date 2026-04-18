"use client";

import { useState } from "react";
import Image from "next/image";
import { FormField, CheckboxIndicator } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepRequirements.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { VENUE_TYPES, ADDITIONAL_SERVICES } from "../../eventsRequestProposalData";

interface StepRequirementsProps {
  data: EventProposalData["requirements"];
  onChange: (patch: Partial<EventProposalData["requirements"]>) => void;
  onContinue: () => void;
  onPrevious: () => void;
}

export default function StepRequirements({
  data,
  onChange,
  onContinue,
  onPrevious,
}: StepRequirementsProps) {

  const toggleService = (id: string) => {
    if (data.additionalServices.includes(id)) {
      onChange({ additionalServices: data.additionalServices.filter(s => s !== id) });
    } else {
      onChange({ additionalServices: [...data.additionalServices, id] });
    }
  };

  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>Event Requirements</h2>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <div className={`${formStyles.field} ${styles.formGroupFull}`}>
            <label id="req-venue-label" className={formStyles.fieldLabel}>Venue Type</label>
            <div style={{ width: '100%', maxWidth: '344px' }}>
              <SelectDropdown
                id="req-venue"
                label="Select Type"
                options={[{ label: "Select Type", value: "" }, ...VENUE_TYPES]}
                value={data.venueType}
                onChange={(val) => onChange({ venueType: val })}
                triggerClassName={pageStyles.formInput}
              />
            </div>
          </div>

          <div className={styles.additionalServicesRow}>
            <label className={formStyles.fieldLabel}>Additional Services</label>
            <div className={styles.serviceGrid}>
              {ADDITIONAL_SERVICES.map((service) => {
                const isSelected = data.additionalServices.includes(service.id);
                return (
                  <label 
                    key={service.id} 
                    className={styles.serviceCard}
                  >
                    <CheckboxIndicator
                      variant="square"
                      size="md"
                      selected={isSelected}
                    />
                    {/* Hide real checkbox */}
                    <input 
                      type="checkbox" 
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                      checked={isSelected}
                      onChange={() => toggleService(service.id)}
                    />
                    <span className={styles.serviceCardText}>
                      {service.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <FormField
            id="req-add"
            label="Additional Requirements"
            isTextarea
            wrapperClassName={pageStyles.formGroupFull}
            className={pageStyles.formInput}
            placeholder="Any Specific requirements, Prefrences, or Special requests...."
            value={data.additionalRequirements}
            onChange={(e) => onChange({ additionalRequirements: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <hr className={pageStyles.stepFormCardDivider} aria-hidden="true" />

      <div className={pageStyles.stepFormCardFooter}>
        <div className={pageStyles.formActions}>
          <button className={pageStyles.previousButton} onClick={onPrevious} type="button">
            Previous
          </button>
          <button className={pageStyles.continueButton} onClick={onContinue} type="button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

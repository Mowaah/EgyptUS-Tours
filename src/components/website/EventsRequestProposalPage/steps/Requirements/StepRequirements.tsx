"use client";

import { BookingStepFooter, FormField, CheckboxIndicator } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepRequirements.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { VENUE_TYPES, ADDITIONAL_SERVICES } from "../../eventsRequestProposalData";
import { useTranslation } from "@/hooks/useTranslation";

interface StepRequirementsProps {
  data: EventProposalData["requirements"];
  onChange: (patch: Partial<EventProposalData["requirements"]>) => void;
  onContinue: () => void;
  onPrevious: () => void;
  errors?: Record<string, string>;
}

export default function StepRequirements({
  data,
  onChange,
  onContinue,
  onPrevious,
  errors = {},
}: StepRequirementsProps) {
  const { t } = useTranslation("events");

  const toggleService = (id: string) => {
    if (data.additionalServices.includes(id)) {
      onChange({ additionalServices: data.additionalServices.filter((s) => s !== id) });
    } else {
      onChange({ additionalServices: [...data.additionalServices, id] });
    }
  };

  const venueOptions = VENUE_TYPES.map((vt) => ({
    label: t(`proposal.options.venueTypes.${vt.value}`, vt.label),
    value: vt.value,
  }));

  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>
            {t("proposal.requirements.title", "Event Requirements")}
          </h2>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <FormField label={t("proposal.requirements.venueType", "Venue Type")} required wrapperClassName={styles.formGroupFull} error={errors.venueType}>
            <div style={{ width: "100%", maxWidth: "344px" }}>
              <SelectDropdown
                id="req-venue"
                label={t("proposal.requirements.selectVenueType", "Select Type")}
                options={[{ label: t("proposal.requirements.selectVenueType", "Select Type"), value: "" }, ...venueOptions]}
                value={data.venueType}
                onChange={(val) => onChange({ venueType: val })}
                triggerClassName={pageStyles.formInput}
                error={!!errors.venueType}
              />
            </div>
          </FormField>

          <div className={styles.additionalServicesRow}>
            <label className={formStyles.fieldLabel}>
              {t("proposal.requirements.additionalServices", "Additional Services")} <span style={{ color: "#0E2851" }}>*</span>
            </label>
            <div className={styles.serviceGrid}>
              {ADDITIONAL_SERVICES.map((service) => {
                const isSelected = data.additionalServices.includes(service.id);
                const serviceLabel = t(`proposal.options.additionalServices.${service.id}`, service.label);
                return (
                  <label key={service.id} className={styles.serviceCard}>
                    <CheckboxIndicator
                      variant="square"
                      size="md"
                      selected={isSelected}
                      aria-hidden
                    />
                    <input
                      type="checkbox"
                      style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                      checked={isSelected}
                      onChange={() => toggleService(service.id)}
                    />
                    <span className={styles.serviceCardText}>{serviceLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <FormField
            id="req-add"
            label={t("proposal.requirements.additionalRequirements", "Additional Requirements")}
            isTextarea
            wrapperClassName={pageStyles.formGroupFull}
            className={pageStyles.formInput}
            placeholder={t("proposal.requirements.additionalRequirementsPlaceholder", "Any Specific requirements, Preferences, or Special requests....")}
            value={data.additionalRequirements}
            onChange={(e) => onChange({ additionalRequirements: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <BookingStepFooter onPrevious={onPrevious} onContinue={onContinue} />
    </div>
  );
}

"use client";

import { BookingStepFooter, FormField, CustomDatePicker } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { EVENT_TYPES, ATTENDEE_RANGES, CITIES } from "../../eventsRequestProposalData";
import { useTranslation } from "@/hooks/useTranslation";

interface StepEventDetailsProps {
  data: EventProposalData["eventDetails"];
  onChange: (patch: Partial<EventProposalData["eventDetails"]>) => void;
  onContinue: () => void;
  onPrevious: () => void;
  errors?: Record<string, string>;
}

export default function StepEventDetails({
  data,
  onChange,
  onContinue,
  onPrevious,
  errors = {},
}: StepEventDetailsProps) {
  const { t } = useTranslation("events");

  const eventTypeOptions = EVENT_TYPES.map((et) => ({
    label: t(`proposal.options.eventTypes.${et.value}`, et.label),
    value: et.value,
  }));

  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>
            {t("proposal.eventDetails.title", "Event Details")}
          </h2>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <FormField label={t("proposal.eventDetails.eventType", "Event Type")} required error={errors.eventType}>
            <SelectDropdown
              id="evt-type"
              label={t("proposal.eventDetails.selectEventType", "Select Type")}
              options={[{ label: t("proposal.eventDetails.selectEventType", "Select Type"), value: "" }, ...eventTypeOptions]}
              value={data.eventType}
              onChange={(val) => onChange({ eventType: val })}
              triggerClassName={pageStyles.formInput}
              error={!!errors.eventType}
            />
          </FormField>

          <FormField
            id="evt-name"
            label={t("proposal.eventDetails.eventName", "Event Name")}
            className={pageStyles.formInput}
            type="text"
            required
            placeholder={t("proposal.eventDetails.eventNamePlaceholder", "ex. Annual sales conferences 2026")}
            value={data.eventName}
            onChange={(e) => onChange({ eventName: e.target.value })}
            error={errors.eventName}
          />

          <FormField label={t("proposal.eventDetails.expectedAttendees", "Expected Attendees")} required error={errors.expectedAttendees}>
            <SelectDropdown
              id="evt-attendees"
              label={t("proposal.eventDetails.selectAttendees", "Select Range")}
              options={[{ label: t("proposal.eventDetails.selectAttendees", "Select Range"), value: "" }, ...ATTENDEE_RANGES]}
              value={data.expectedAttendees}
              onChange={(val) => onChange({ expectedAttendees: val })}
              triggerClassName={pageStyles.formInput}
              error={!!errors.expectedAttendees}
            />
          </FormField>

          <FormField label={t("proposal.eventDetails.preferredCity", "Preferred City")} required error={errors.preferredCity}>
            <SelectDropdown
              id="evt-city"
              label={t("proposal.eventDetails.selectCity", "Select City")}
              options={[{ label: t("proposal.eventDetails.selectCity", "Select City"), value: "" }, ...CITIES]}
              value={data.preferredCity}
              onChange={(val) => onChange({ preferredCity: val })}
              triggerClassName={pageStyles.formInput}
              error={!!errors.preferredCity}
            />
          </FormField>

          <FormField label={t("proposal.eventDetails.startDate", "Start Date")} required error={errors.startDate}>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={data.startDate}
              onChange={(date) => onChange({ startDate: date })}
              error={!!errors.startDate}
            />
          </FormField>

          <FormField label={t("proposal.eventDetails.endDate", "End Date")} required error={errors.endDate}>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={data.endDate}
              onChange={(date) => onChange({ endDate: date })}
              error={!!errors.endDate}
            />
          </FormField>

          <FormField
            id="evt-desc"
            label={t("proposal.eventDetails.description", "Event Description")}
            isTextarea
            wrapperClassName={pageStyles.formGroupFull}
            className={pageStyles.formInput}
            placeholder={t("proposal.eventDetails.descriptionPlaceholder", "Brief description of your event objectives and key activities..")}
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <BookingStepFooter onPrevious={onPrevious} onContinue={onContinue} />
    </div>
  );
}

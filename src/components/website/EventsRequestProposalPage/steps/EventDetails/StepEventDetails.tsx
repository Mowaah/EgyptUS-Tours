"use client";

import { BookingStepFooter, FormField, CustomDatePicker } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { EVENT_TYPES, ATTENDEE_RANGES, CITIES } from "../../eventsRequestProposalData";

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
  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>Event Details</h2>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <FormField label="Event Type" required error={errors.eventType}>
            <SelectDropdown
              id="evt-type"
              label="Select Type"
              options={[{ label: "Select Type", value: "" }, ...EVENT_TYPES]}
              value={data.eventType}
              onChange={(val) => onChange({ eventType: val })}
              triggerClassName={pageStyles.formInput}
            />
          </FormField>

          <FormField
            id="evt-name"
            label="Event Name"
            className={pageStyles.formInput}
            type="text"
            required
            placeholder="ex. Annual sales conferences 2026"
            value={data.eventName}
            onChange={(e) => onChange({ eventName: e.target.value })}
            error={errors.eventName}
          />

          <FormField label="Expected Attendees" required error={errors.expectedAttendees}>
            <SelectDropdown
              id="evt-attendees"
              label="Select Range"
              options={[{ label: "Select Range", value: "" }, ...ATTENDEE_RANGES]}
              value={data.expectedAttendees}
              onChange={(val) => onChange({ expectedAttendees: val })}
              triggerClassName={pageStyles.formInput}
            />
          </FormField>

          <FormField label="Preferred City" required error={errors.preferredCity}>
            <SelectDropdown
              id="evt-city"
              label="Select City"
              options={[{ label: "Select City", value: "" }, ...CITIES]}
              value={data.preferredCity}
              onChange={(val) => onChange({ preferredCity: val })}
              triggerClassName={pageStyles.formInput}
            />
          </FormField>

          <FormField label="Start Date" required error={errors.startDate}>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={data.startDate}
              onChange={(date) => onChange({ startDate: date })}
            />
          </FormField>

          <FormField label="End Date" required error={errors.endDate}>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={data.endDate}
              onChange={(date) => onChange({ endDate: date })}
            />
          </FormField>

          <FormField
            id="evt-desc"
            label="Event Description"
            isTextarea
            wrapperClassName={pageStyles.formGroupFull}
            className={pageStyles.formInput}
            placeholder="Brief description of your event objectives and key activities.."
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

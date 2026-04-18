"use client";

import { FormField, CustomDatePicker } from "@/components/shared";
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
}

export default function StepEventDetails({
  data,
  onChange,
  onContinue,
  onPrevious,
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
          <div className={formStyles.field}>
            <label id="evt-type-label" className={formStyles.fieldLabel}>Event Type</label>
            <SelectDropdown
              id="evt-type"
              label="Select Type"
              options={[{ label: "Select Type", value: "" }, ...EVENT_TYPES]}
              value={data.eventType}
              onChange={(val) => onChange({ eventType: val })}
              triggerClassName={pageStyles.formInput}
            />
          </div>

          <FormField
            id="evt-name"
            label="Event Name"
            className={pageStyles.formInput}
            type="text"
            placeholder="ex. Annual sales conferences 2026"
            value={data.eventName}
            onChange={(e) => onChange({ eventName: e.target.value })}
          />

          <div className={formStyles.field}>
            <label id="evt-attendees-label" className={formStyles.fieldLabel}>Expected Attendees</label>
            <SelectDropdown
              id="evt-attendees"
              label="Select Range"
              options={[{ label: "Select Range", value: "" }, ...ATTENDEE_RANGES]}
              value={data.expectedAttendees}
              onChange={(val) => onChange({ expectedAttendees: val })}
              triggerClassName={pageStyles.formInput}
            />
          </div>

          <div className={formStyles.field}>
            <label id="evt-city-label" className={formStyles.fieldLabel}>Preferred City</label>
            <SelectDropdown
              id="evt-city"
              label="Select City"
              options={[{ label: "Select City", value: "" }, ...CITIES]}
              value={data.preferredCity}
              onChange={(val) => onChange({ preferredCity: val })}
              triggerClassName={pageStyles.formInput}
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.fieldLabel}>Start Date</label>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={data.startDate}
              onChange={(date) => onChange({ startDate: date })}
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.fieldLabel}>End Date</label>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={data.endDate}
              onChange={(date) => onChange({ endDate: date })}
            />
          </div>

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

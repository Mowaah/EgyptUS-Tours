"use client";

import { BookingStepFooter, FormField, PhonePrefixSelect } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepOrganization.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { INDUSTRIES } from "../../eventsRequestProposalData";

interface StepOrganizationProps {
  data: EventProposalData["organization"];
  onChange: (patch: Partial<EventProposalData["organization"]>) => void;
  onContinue: () => void;
  onPrevious: () => void;
}

export default function StepOrganization({
  data,
  onChange,
  onContinue,
}: StepOrganizationProps) {
  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>Organization Information</h2>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <FormField
            id="org-name"
            label="Organization Name"
            className={pageStyles.formInput}
            type="text"
            placeholder="Company or Organization Name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />

          <div className={formStyles.field}>
            <label id="org-industry-label" className={formStyles.fieldLabel}>Industry</label>
            <SelectDropdown
              id="org-industry"
              label="Select Industry"
              options={INDUSTRIES}
              value={data.industry}
              onChange={(val) => onChange({ industry: val })}
              triggerClassName={pageStyles.formInput}
            />
          </div>

          <FormField
            id="org-country"
            label="Country"
            className={pageStyles.formInput}
            type="text"
            placeholder="Headquarters Country"
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
          />

          <FormField
            id="org-website"
            label="Website"
            className={pageStyles.formInput}
            type="text"
            placeholder="www.company.com"
            value={data.website}
            onChange={(e) => onChange({ website: e.target.value })}
          />

          <FormField
            id="org-contact"
            label="Contact Person"
            className={pageStyles.formInput}
            type="text"
            placeholder="Full Name"
            value={data.contactPerson}
            onChange={(e) => onChange({ contactPerson: e.target.value })}
          />

          <FormField
            id="org-job"
            label="Job Title"
            className={pageStyles.formInput}
            type="text"
            placeholder="Your Position"
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
          />

          <FormField
            id="org-email"
            label="Email Address"
            className={pageStyles.formInput}
            type="email"
            placeholder="youremail@company.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />

          <div className={formStyles.field}>
            <label htmlFor="org-phone" className={formStyles.fieldLabel}>Phone Number</label>
            <div className={styles.phoneRow}>
              <PhonePrefixSelect
                phoneValue={data.phone}
                onPhoneChange={(val) => onChange({ phone: val })}
              />
              <input
                id="org-phone"
                type="tel"
                className={`${formStyles.input} ${styles.phoneInput}`}
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className={pageStyles.stepFormCardDivider} aria-hidden="true" />

      <BookingStepFooter onContinue={onContinue} />
    </div>
  );
}

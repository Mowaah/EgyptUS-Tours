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
            required
            placeholder="Company or Organization Name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />

          <FormField label="Industry" required>
            <SelectDropdown
              id="org-industry"
              label="Select Industry"
              options={INDUSTRIES}
              value={data.industry}
              onChange={(val) => onChange({ industry: val })}
              triggerClassName={pageStyles.formInput}
            />
          </FormField>

          <FormField
            id="org-country"
            label="Country"
            className={pageStyles.formInput}
            type="text"
            required
            placeholder="Headquarters Country"
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
          />

          <FormField
            id="org-website"
            label="Website"
            className={pageStyles.formInput}
            type="text"
            required
            placeholder="www.company.com"
            value={data.website}
            onChange={(e) => onChange({ website: e.target.value })}
          />

          <FormField
            id="org-contact"
            label="Contact Person"
            className={pageStyles.formInput}
            type="text"
            required
            placeholder="Full Name"
            value={data.contactPerson}
            onChange={(e) => onChange({ contactPerson: e.target.value })}
          />

          <FormField
            id="org-job"
            label="Job Title"
            className={pageStyles.formInput}
            type="text"
            required
            placeholder="Your Position"
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
          />

          <FormField
            id="org-email"
            label="Email Address"
            className={pageStyles.formInput}
            type="email"
            required
            placeholder="youremail@company.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />

          <FormField label="Phone Number" required>
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
          </FormField>
        </div>
      </div>


      <BookingStepFooter onContinue={onContinue} />
    </div>
  );
}

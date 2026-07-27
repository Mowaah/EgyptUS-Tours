"use client";

import { BookingStepFooter, FormField, PhoneInput } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import styles from "./StepOrganization.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { INDUSTRIES } from "../../eventsRequestProposalData";

interface StepOrganizationProps {
  data: EventProposalData["organization"];
  onChange: (patch: Partial<EventProposalData["organization"]>) => void;
  onContinue: () => void;
  onPrevious: () => void;
  errors?: Record<string, string>;
}

export default function StepOrganization({
  data,
  onChange,
  onContinue,
  errors = {},
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
            error={errors.name}
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
            error={errors.country}
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
            error={errors.website}
          />

          <FormField
            id="org-contact"
            name="name"
            autoComplete="name"
            label="Contact Person"
            className={pageStyles.formInput}
            type="text"
            required
            placeholder="Full Name"
            value={data.contactPerson}
            onChange={(e) => onChange({ contactPerson: e.target.value })}
            error={errors.contactPerson}
          />

          <FormField
            id="org-job"
            name="organization-title"
            autoComplete="organization-title"
            label="Job Title"
            className={pageStyles.formInput}
            type="text"
            required
            placeholder="Your Position"
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            error={errors.jobTitle}
          />

          <FormField
            id="org-email"
            name="email"
            autoComplete="email"
            label="Email Address"
            className={pageStyles.formInput}
            type="email"
            required
            placeholder="youremail@company.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            error={errors.email}
          />

          <FormField label="Phone Number" required>
            <PhoneInput
              id="org-phone"
              name="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(val) => onChange({ phone: val })}
              error={errors.phone}
            />
          </FormField>
        </div>
      </div>

      <BookingStepFooter onContinue={onContinue} />
    </div>
  );
}

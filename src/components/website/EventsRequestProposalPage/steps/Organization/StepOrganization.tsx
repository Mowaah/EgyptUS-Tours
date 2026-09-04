"use client";

import { BookingStepFooter, FormField, PhoneInput } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { INDUSTRIES } from "../../eventsRequestProposalData";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation("events");

  const industryOptions = INDUSTRIES.map((ind) => ({
    label: t(`proposal.options.industries.${ind.value}`, ind.label),
    value: ind.value,
  }));

  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>
            {t("proposal.organization.title", "Organization Information")}
          </h2>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <FormField
            id="org-name"
            label={t("proposal.organization.name", "Organization Name")}
            className={pageStyles.formInput}
            type="text"
            required
            placeholder={t("proposal.organization.namePlaceholder", "Company or Organization Name")}
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            error={errors.name}
          />

          <FormField label={t("proposal.organization.industry", "Industry")} required error={errors.industry}>
            <SelectDropdown
              id="org-industry"
              label={t("proposal.organization.selectIndustry", "Select Industry")}
              options={industryOptions}
              value={data.industry}
              onChange={(val) => onChange({ industry: val })}
              triggerClassName={pageStyles.formInput}
              error={!!errors.industry}
            />
          </FormField>

          <FormField
            id="org-country"
            label={t("proposal.organization.country", "Country")}
            className={pageStyles.formInput}
            type="text"
            required
            placeholder={t("proposal.organization.country", "Country")}
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
            error={errors.country}
          />

          <FormField
            id="org-website"
            label={t("proposal.organization.website", "Website")}
            className={pageStyles.formInput}
            type="text"
            placeholder={t("proposal.organization.websitePlaceholder", "www.company.com")}
            value={data.website}
            onChange={(e) => onChange({ website: e.target.value })}
            error={errors.website}
          />

          <FormField
            id="org-contact"
            name="name"
            autoComplete="name"
            label={t("proposal.organization.contactPerson", "Contact Person")}
            className={pageStyles.formInput}
            type="text"
            required
            placeholder={t("proposal.organization.contactPersonPlaceholder", "Full Name")}
            value={data.contactPerson}
            onChange={(e) => onChange({ contactPerson: e.target.value })}
            error={errors.contactPerson}
          />

          <FormField
            id="org-job"
            name="organization-title"
            autoComplete="organization-title"
            label={t("proposal.organization.jobTitle", "Job Title")}
            className={pageStyles.formInput}
            type="text"
            required
            placeholder={t("proposal.organization.jobTitlePlaceholder", "Your Position")}
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            error={errors.jobTitle}
          />

          <FormField
            id="org-email"
            name="email"
            autoComplete="email"
            label={t("proposal.organization.email", "Email Address")}
            className={pageStyles.formInput}
            type="email"
            required
            placeholder={t("proposal.organization.emailPlaceholder", "youremail@company.com")}
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            error={errors.email}
          />

          <FormField label={t("proposal.organization.phone", "Phone Number")} required error={errors.phone}>
            <PhoneInput
              id="org-phone"
              name="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(val) => onChange({ phone: val })}
              hasError={!!errors.phone}
            />
          </FormField>
        </div>
      </div>

      <BookingStepFooter onContinue={onContinue} />
    </div>
  );
}

"use client";

import Image from "next/image";
import { BookingStepFooter, FormField } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import styles from "./StepBudget.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { BUDGET_RANGES, BUDGET_FLEXIBILITY, SOURCES } from "../../eventsRequestProposalData";
import { useTranslation } from "@/hooks/useTranslation";

interface StepBudgetProps {
  data: EventProposalData["budget"];
  onChange: (patch: Partial<EventProposalData["budget"]>) => void;
  onContinue: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  errors?: Record<string, string>;
}

export default function StepBudget({
  data,
  onChange,
  onContinue,
  onPrevious,
  isSubmitting,
  submitError,
  errors = {},
}: StepBudgetProps) {
  const { t } = useTranslation("events");

  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>
            {t("proposal.budget.title", "Budget & Submission")}
          </h2>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <FormField label={t("proposal.budget.estimatedBudget", "Estimated Budget")} required error={errors.estimatedBudget}>
            <SelectDropdown
              id="bud-est"
              label={t("proposal.budget.selectBudget", "Select Type")}
              options={[{ label: t("proposal.budget.selectBudget", "Select Type"), value: "" }, ...BUDGET_RANGES]}
              value={data.estimatedBudget}
              onChange={(val) => onChange({ estimatedBudget: val })}
              triggerClassName={pageStyles.formInput}
            />
          </FormField>

          <FormField label={t("proposal.budget.budgetFlexibility", "Budget Flexibility")} required error={errors.budgetFlexibility}>
            <SelectDropdown
              id="bud-flex"
              label={t("proposal.budget.budgetFlexibility", "Select Type")}
              options={BUDGET_FLEXIBILITY.map((opt) => ({ label: opt.label, value: opt.id }))}
              value={data.budgetFlexibility}
              onChange={(val) => onChange({ budgetFlexibility: val })}
              triggerClassName={pageStyles.formInput}
            />
          </FormField>

          <FormField label={t("proposal.budget.hearAboutUs", "How did you hear about us?")}>
            <SelectDropdown
              id="bud-source"
              label={t("proposal.budget.selectSource", "Select Source")}
              options={[{ label: t("proposal.budget.selectSource", "Select Source"), value: "" }, ...SOURCES]}
              value={data.hearAboutUs}
              onChange={(val) => onChange({ hearAboutUs: val })}
              triggerClassName={pageStyles.formInput}
            />
          </FormField>

          <div className={`${pageStyles.formGroupFull} ${styles.infoBoxWrapper}`}>
            <div className={styles.infoBox}>
              <h3 className={styles.infoBoxTitle}>{t("process.title", "What Happens Next?")}</h3>
              <ul className={styles.infoList}>
                {[
                  t("process.step1Desc", "Our MICE specialists will review your requirements within 24 hours"),
                  t("process.step2Desc", "We'll schedule a consultation call to discuss your event in detail"),
                  t("process.step3Desc", "Receive a comprehensive proposal with venue options, pricing, and timeline"),
                  t("process.step4Desc", "Dedicated account manager assigned to your project"),
                ].map((text, i) => (
                  <li key={i} className={styles.infoListItem}>
                    <div className={styles.infoListIcon}>
                      <Image src="/images/check-blue.svg" alt="" width={10} height={10} />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {submitError && (
        <div style={{ color: "#e53e3e", marginBottom: "16px", padding: "12px", backgroundColor: "#fff5f5", borderRadius: "8px", border: "1px solid #fed7d7", fontSize: "0.9rem" }}>
          {submitError}
        </div>
      )}

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel={isSubmitting ? t("proposal.budget.submitting", "Submitting...") : t("proposal.budget.submitButton", "Submit Request")}
        continueDisabled={isSubmitting}
      />
    </div>
  );
}

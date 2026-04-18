"use client";

import Image from "next/image";
import { FormField } from "@/components/shared";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import pageStyles from "../../EventsRequestProposalPage.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepBudget.module.scss";
import type { EventProposalData } from "../../eventsRequestProposalTypes";
import { BUDGET_RANGES, BUDGET_FLEXIBILITY, SOURCES } from "../../eventsRequestProposalData";

interface StepBudgetProps {
  data: EventProposalData["budget"];
  onChange: (patch: Partial<EventProposalData["budget"]>) => void;
  onContinue: () => void;
  onPrevious: () => void;
}

export default function StepBudget({
  data,
  onChange,
  onContinue,
  onPrevious,
}: StepBudgetProps) {
  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>Budget Information</h2>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <div className={formStyles.field}>
            <label id="bud-est-label" className={formStyles.fieldLabel}>Estimated Budget In USD</label>
            <SelectDropdown
              id="bud-est"
              label="Select Type"
              options={[{ label: "Select Type", value: "" }, ...BUDGET_RANGES]}
              value={data.estimatedBudget}
              onChange={(val) => onChange({ estimatedBudget: val })}
              triggerClassName={pageStyles.formInput}
            />
          </div>

          <div className={formStyles.field}>
            <label id="bud-flex-label" className={formStyles.fieldLabel}>Budget Flexibility</label>
            <SelectDropdown
              id="bud-flex"
              label="Select Type"
              options={BUDGET_FLEXIBILITY.map(opt => ({ label: opt.label, value: opt.id }))}
              value={data.budgetFlexibility}
              onChange={(val) => onChange({ budgetFlexibility: val })}
              triggerClassName={pageStyles.formInput}
            />
          </div>

          <div className={formStyles.field}>
            <label id="bud-source-label" className={formStyles.fieldLabel}>How did you hear about us?</label>
            <SelectDropdown
              id="bud-source"
              label="Select Source"
              options={[{ label: "Select Source", value: "" }, ...SOURCES]}
              value={data.hearAboutUs}
              onChange={(val) => onChange({ hearAboutUs: val })}
              triggerClassName={pageStyles.formInput}
            />
          </div>

          <div className={`${pageStyles.formGroupFull} ${styles.infoBoxWrapper}`}>
            <div className={styles.infoBox}>
              <h3 className={styles.infoBoxTitle}>What Happens Next?</h3>
              <ul className={styles.infoList}>
                {[
                  "Our MICE specialists will review your requirements within 24 hours",
                  "We'll schedule a consultation call to discuss your event in detail",
                  "Receive a comprehensive proposal with venue options, pricing, and timeline",
                  "Dedicated account manager assigned to your project"
                ].map((text, i) => (
                  <li key={i} className={styles.infoListItem}>
                    <div className={styles.infoListIcon}>
                      <Image
                        src="/images/check-blue.svg"
                        alt=""
                        width={10}
                        height={10}
                      />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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

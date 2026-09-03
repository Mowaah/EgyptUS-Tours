"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./BookingStepFooter.module.scss";

type BookingStepFooterProps = {
  onContinue: () => void;
  onPrevious?: () => void;
  continueLabel?: ReactNode;
  previousLabel?: ReactNode;
  continueDisabled?: boolean;
  showMoneyIcon?: boolean;
  footerClassName?: string;
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export default function BookingStepFooter({
  onContinue,
  onPrevious,
  continueLabel,
  previousLabel,
  continueDisabled = false,
  showMoneyIcon = false,
  footerClassName,
}: BookingStepFooterProps) {
  const { t } = useTranslation("common");
  const resolvedContinue = continueLabel ?? t("buttons.continue", "Continue");
  const resolvedPrevious = previousLabel ?? t("buttons.previous", "Previous");

  return (
    <div className={cx(styles.footer, footerClassName)}>
      {onPrevious && (
        <button className={styles.prevBtn} onClick={onPrevious} type="button">
          {resolvedPrevious}
        </button>
      )}

      <button
        className={cx(styles.confirmBtn, !onPrevious && styles.confirmBtnFullWidth)}
        onClick={onContinue}
        type="button"
        disabled={continueDisabled}
      >
        {resolvedContinue}
        {showMoneyIcon && (
          <Image src="/images/money-send.svg" width={20} height={20} alt="" />
        )}
      </button>
    </div>
  );
}

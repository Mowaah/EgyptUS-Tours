"use client";

import React from 'react';
import { SecondaryCta } from '@/components/shared';
import { useTranslation } from '@/hooks/useTranslation';

export default function EventsCTA() {
  const { t } = useTranslation("events");

  return (
    <SecondaryCta 
      heading={t("cta.title", "Ready to Host an Unforgettable Event in Egypt?")}
      description={t("cta.subtitle", "Partner with our dedicated events team to design a bespoke program that exceeds expectations.")}
      buttonText={t("cta.button", "Request a Proposal")}
      buttonHref="/events/request-proposal"
    />
  );
}

import React from 'react';
import { SecondaryCta } from '@/components/shared';

export default function EventsCTA() {
  return (
    <SecondaryCta 
      heading="Ready to Plan Your Corporate Event in Egypt?"
      description="Our expert MICE team will create a customized proposal tailored to your organization's specific requirements and objectives."
      buttonText="Request Proposal"
      buttonHref="/events/request-proposal"
    />
  );
}

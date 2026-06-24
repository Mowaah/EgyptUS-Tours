import React from "react";
import Image from "next/image";
import styles from "./ViewLead.module.scss";
import { LeadRow } from "../types";

interface CustomerInformationProps {
  lead: LeadRow;
  jobTitle?: string;
  companyName?: string;
  linkedinUrl?: string;
  website?: string;
  notes?: string;
}

export default function CustomerInformation({
  lead,
  jobTitle = "Operations Manager",
  companyName = "Nile Horizon Events",
  linkedinUrl = "https://www.linkedin.com/feed/",
  website = "www.nilehorizonevents.com",
  notes = "We are looking for a complete tourism management solution to manage bookings, customer inquiries, transportation services, and partner coordination more efficiently."
}: CustomerInformationProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleIcon}>
          <Image
            src="/images/dashboard/inquiries/customer_information.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        Customer Information
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Name</span>
          <span className={styles.infoValue}>{lead.name}</span>
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email Address</span>
          <span className={styles.infoValue}>{lead.email}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Phone Number</span>
          <span className={styles.infoValue}>{lead.phone}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Source</span>
          <span className={styles.infoValue}>{lead.source}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Job Title</span>
          <span className={styles.infoValue}>{jobTitle}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Company Name</span>
          <span className={styles.infoValue}>{companyName}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Person Linkedin Url</span>
          <span className={styles.infoValue}>{linkedinUrl}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Website</span>
          <span className={styles.infoValue}>{website}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Notes</span>
          <span className={styles.infoValue}>{notes}</span>
        </div>
      </div>
    </div>
  );
}

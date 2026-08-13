import React from "react";
import Image from "next/image";
import styles from "./ViewLead.module.scss";
import type { AdminLead } from "@/types/adminLeadTypes";

interface CustomerInformationProps {
  lead: AdminLead;
}

export default function CustomerInformation({ lead }: CustomerInformationProps) {
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
          <span className={styles.infoValue}>{lead.full_name}</span>
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
          <span className={styles.infoValue}>{(() => {
            let formattedSource = (lead.source || "").replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (formattedSource.toLowerCase() === "whatsapp") formattedSource = "WhatsApp";
            return formattedSource;
          })()}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Job Title</span>
          <span className={styles.infoValue}>{lead.job_title || "-"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Company Name</span>
          <span className={styles.infoValue}>{lead.company_name || "-"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Person Linkedin Url</span>
          <span className={styles.infoValue}>{lead.linkedin_url || "-"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Website</span>
          <span className={styles.infoValue}>{lead.website || "-"}</span>
        </div>
      </div>
    </div>
  );
}

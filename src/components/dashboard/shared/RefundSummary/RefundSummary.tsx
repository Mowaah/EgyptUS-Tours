import React from "react";
import Image from "next/image";
import styles from "./RefundSummary.module.scss";

export interface RefundData {
  reference: string;
  notes: string;
  file?: File;
}

interface RefundSummaryProps {
  data: RefundData;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function RefundSummary({ data }: RefundSummaryProps) {
  if (!data) return null;

  const fileName = data.file?.name || "Refund Payment.pdf";
  const fileSize = data.file?.size ? formatBytes(data.file.size) : "200 KB";
  const fileExt = fileName.split('.').pop()?.toUpperCase() || 'PDF';
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 13.7483C9.5 14.7183 10.25 15.4983 11.17 15.4983H13.05C13.85 15.4983 14.5 14.8183 14.5 13.9683C14.5 13.0583 14.1 12.7283 13.51 12.5183L10.5 11.4683C9.91 11.2583 9.51001 10.9383 9.51001 10.0183C9.51001 9.17828 10.16 8.48828 10.96 8.48828H12.84C13.76 8.48828 14.51 9.26828 14.51 10.2383" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7.5V16.5" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 15.94 4.28001 19.35 7.60001 20.98" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 12C22 17.52 17.52 22 12 22" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 6V2H18" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 7L22 2" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>Refund Summary</h2>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Package Total</span>
        <span className={styles.value}>£2,500</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Days Before Travel</span>
        <span className={styles.value}>20 Days</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Cancellation Policy Applied</span>
        <span className={styles.value}>29–15 days before service</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Deduction</span>
        <span className={styles.value}>40%</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Deduction Amount</span>
        <span className={styles.value}>£1,000</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Refund Amount</span>
        <span className={styles.refundAmountPill}>£1,500</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Transaction Reference</span>
        <span className={styles.value}>{data.reference || "FT24032658791"}</span>
      </div>

      <div className={styles.receiptSection}>
        <span className={styles.label}>Refund Receipt</span>
        <div className={styles.fileItem}>
          <div className={styles.fileIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 3.33334H24.1667L32.5 11.6667V36.6667C32.5 37.1087 32.3244 37.5326 32.0118 37.8452C31.6993 38.1577 31.2754 38.3333 30.8333 38.3333H7.5C7.05797 38.3333 6.63405 38.1577 6.32149 37.8452C6.00893 37.5326 5.83333 37.1087 5.83333 36.6667V5C5.83333 4.55797 6.00893 4.13405 6.32149 3.82149C6.63405 3.50893 7.05797 3.33334 7.5 3.33334Z" stroke="#D8DDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24.1667 3.33334V11.6667H32.5" stroke="#D8DDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="7" y="17" width="22" height="15" rx="2" fill="#D92D20"/>
              <text x="18" y="27" fill="white" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif" textAnchor="middle">
                {fileExt}
              </text>
            </svg>
          </div>
          <div className={styles.fileContent}>
            <p className={styles.fileName}>{fileName}</p>
            <span className={styles.fileSize}>{fileSize} of {fileSize}</span>
          </div>
        </div>
      </div>

      {(data.notes || "We are looking for a complete tourism management solution to manage bookings, customer inquiries, transportation services, and partner coordination more efficiently.") && (
        <div className={styles.notesSection}>
          <span className={styles.label}>Notes</span>
          <p className={styles.noteText}>
            {data.notes || "We are looking for a complete tourism management solution to manage bookings, customer inquiries, transportation services, and partner coordination more efficiently."}
          </p>
        </div>
      )}
    </div>
  );
}

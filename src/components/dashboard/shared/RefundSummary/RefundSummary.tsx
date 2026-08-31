import React from "react";
import Image from "next/image";
import styles from "./RefundSummary.module.scss";

export interface RefundData {
  reference?: string;
  transaction_reference?: string;
  notes?: string;
  file?: File;
  receipt_file?: string;
  package_total?: number | string;
  paid_amount?: number | string;
  days_before_travel?: number;
  policy_applied?: string;
  policy_label?: string;
  deduction_percentage?: number | string;
  deduction_percent?: number | string;
  deduction_amount?: number | string;
  refund_amount?: number | string;
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

  const fileName = data.file?.name || (data.receipt_file ? data.receipt_file.split('/').pop() : "Refund Payment.pdf");
  const fileSize = data.file?.size ? formatBytes(data.file.size) : undefined;
  const fileExt = fileName?.split('.').pop()?.toUpperCase() || 'PDF';
  
  const pkgTotal = data.package_total || data.paid_amount || "0";
  const daysBefore = data.days_before_travel ?? "0";
  const policy = data.policy_applied || data.policy_label || "N/A";
  const deductionPct = data.deduction_percentage || data.deduction_percent || "0";
  const deductionAmt = data.deduction_amount || "0";
  const refundAmt = data.refund_amount || "0";
  const ref = data.transaction_reference || data.reference || "N/A";
  
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
        <span className={styles.value}>£{parseFloat(String(pkgTotal)).toLocaleString()}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Days Before Travel</span>
        <span className={styles.value}>{daysBefore} Days</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Cancellation Policy Applied</span>
        <span className={styles.value}>{policy}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Deduction</span>
        <span className={styles.value}>{deductionPct}%</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Deduction Amount</span>
        <span className={styles.value}>£{parseFloat(String(deductionAmt)).toLocaleString()}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Refund Amount</span>
        <span className={styles.refundAmountPill}>£{parseFloat(String(refundAmt)).toLocaleString()}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Transaction Reference</span>
        <span className={styles.value}>{ref}</span>
      </div>

      {(data.file || data.receipt_file) && (
        <div className={styles.receiptSection}>
          <span className={styles.label}>Refund Receipt</span>
          <a href={data.receipt_file || "#"} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
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
                {fileSize && <span className={styles.fileSize}>{fileSize}</span>}
              </div>
            </div>
          </a>
        </div>
      )}

      {data.notes && (
        <div className={styles.notesSection}>
          <span className={styles.label}>Notes</span>
          <p className={styles.noteText}>
            {data.notes}
          </p>
        </div>
      )}
    </div>
  );
}

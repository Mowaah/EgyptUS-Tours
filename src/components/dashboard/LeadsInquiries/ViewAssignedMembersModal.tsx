import React, { useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/shared";
import formStyles from "@/components/dashboard/FormFields/FormFields.module.scss";
import styles from "./ViewAssignedMembersModal.module.scss";

interface ViewAssignedMembersModalProps {
  open: boolean;
  onClose: () => void;
  onReassign: () => void;
}

export function ViewAssignedMembersModal({ open, onClose, onReassign }: ViewAssignedMembersModalProps) {
  useEffect(() => {
    if (!open) return;
    
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="View Assigned Members"
          iconSrc="/images/dashboard/inquiries/inquiries.svg"
          onClose={onClose}
        />

        <div className={styles.content}>
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Attachment</span>
            <div 
              className={formStyles.fileItem} 
              style={{ 
                border: "1px solid #E5E7EB", 
                borderRadius: "24px", 
                height: "72px", 
                alignItems: "center",
                padding: "16px",
                boxSizing: "border-box"
              }}
            >
              <div className={formStyles.fileIconWrapper} style={{ height: "40px", display: "flex", alignItems: "center" }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 3.33334H24.1667L32.5 11.6667V36.6667C32.5 37.1087 32.3244 37.5326 32.0118 37.8452C31.6993 38.1577 31.2754 38.3333 30.8333 38.3333H7.5C7.05797 38.3333 6.63405 38.1577 6.32149 37.8452C6.00893 37.5326 5.83333 37.1087 5.83333 36.6667V5C5.83333 4.55797 6.00893 4.13405 6.32149 3.82149C6.63405 3.50893 7.05797 3.33334 7.5 3.33334Z" stroke="#D8DDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24.1667 3.33334V11.6667H32.5" stroke="#D8DDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="7" y="17" width="22" height="15" rx="2" fill="#079455"/>
                  <text x="18" y="27" fill="white" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif" textAnchor="middle">
                    CSV
                  </text>
                </svg>
              </div>
              
              <div className={formStyles.fileInfo} style={{ gap: "4px", justifyContent: "center" }}>
                <p className={formStyles.fileName} style={{ color: "#2B2B38", margin: 0, lineHeight: "1" }}>New Leads - 21/7/2026.Csv</p>
                <div className={formStyles.fileMeta} style={{ margin: 0 }}>
                  <span className={formStyles.fileSize} style={{ color: "#606978", lineHeight: "1" }}>200 KB of 200 KB</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Team Members ( Sales )</span>
            <div className={styles.teamMembersGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={styles.teamMemberPill}>
                  <Image src="/images/dashboard/sara.jpg" alt="" width={32} height={32} className={styles.teamMemberImage} />
                  <span className={styles.teamMemberName}>Mohamed Ahmed</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Team Members ( Operation )</span>
            <div className={styles.teamMembersGrid}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.teamMemberPill}>
                  <Image src="/images/dashboard/sara.jpg" alt="" width={32} height={32} className={styles.teamMemberImage} />
                  <span className={styles.teamMemberName}>Mohamed Ahmed</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ModalFooter
          primaryLabel="Reassign Leads"
          primaryOnClick={onReassign}
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
        />
      </div>
    </div>
  );
}

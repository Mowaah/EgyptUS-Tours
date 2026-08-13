import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import formStyles from "@/components/dashboard/FormFields/FormFields.module.scss";
import styles from "./ViewAssignedMembersModal.module.scss";
import { useLeadImportBatch } from "@/hooks/useLeadImportBatches";
import type { AdminLeadImportBatchAssignee } from "@/types/adminLeadTypes";

interface ViewAssignedMembersModalProps {
  open: boolean;
  onClose: () => void;
  onReassign: () => void;
  batchId?: number;
}

export function ViewAssignedMembersModal({ open, onClose, onReassign, batchId }: ViewAssignedMembersModalProps) {
  const { data: batchData, isLoading } = useLeadImportBatch(open && batchId ? batchId : 0);

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

  const assigneesByTeam = useMemo(() => {
    if (!batchData?.assignees) return {} as Record<string, AdminLeadImportBatchAssignee[]>;
    return batchData.assignees.reduce((acc: Record<string, AdminLeadImportBatchAssignee[]>, assignee: AdminLeadImportBatchAssignee) => {
      const team = assignee.team || "Unknown";
      if (!acc[team]) acc[team] = [];
      acc[team].push(assignee);
      return acc;
    }, {});
  }, [batchData]);

  const getImageUrl = (path?: string) => {
    if (!path) return "/images/dashboard/sara.jpg";
    if (path.startsWith("http")) return path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${apiUrl}${path}`;
  };

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
                <Image
                  src="/images/dashboard/file/csv.svg"
                  alt="CSV file"
                  width={40}
                  height={40}
                />
              </div>
              
              <div className={formStyles.fileInfo} style={{ gap: "4px", justifyContent: "center" }}>
                <p className={formStyles.fileName} style={{ color: "#2B2B38", margin: 0, lineHeight: "1" }}>
                  {batchData?.filename || "Leads Import"}
                </p>
                {batchData?.row_count != null && (
                  <p className={formStyles.fileSize} style={{ margin: 0, lineHeight: "1" }}>
                    {batchData.row_count} records
                  </p>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: "24px", textAlign: "center" }}>Loading...</div>
          ) : (
            (Object.entries(assigneesByTeam) as [string, AdminLeadImportBatchAssignee[]][]).map(([team, members]) => (
              <div key={team} className={styles.section}>
                <span className={styles.sectionTitle}>Team Members ( {team} )</span>
                <div className={styles.teamMembersGrid}>
                  {members.map((member) => (
                    <div key={member.id} className={styles.teamMemberPill}>
                      <Image 
                        src={getImageUrl(member.profile_picture ?? undefined)} 
                        alt={member.full_name} 
                        width={32} 
                        height={32} 
                        className={styles.teamMemberImage} 
                        style={{ objectFit: "cover" }}
                      />
                      <span className={styles.teamMemberName}>{member.full_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
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

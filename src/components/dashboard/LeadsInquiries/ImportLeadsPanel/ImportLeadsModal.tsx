"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/components/dashboard/FormFields/UploadDropzone";
import DashboardField from "@/components/shared/DashboardField/DashboardField";
import { ModalHeader, ModalFooter, IconStepper } from "@/components/shared";
import styles from "./ImportLeadsModal.module.scss";

interface ImportLeadsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportLeadsModal({ open, onClose, onSuccess }: ImportLeadsModalProps) {
  const [file, setFile] = useState<File | undefined>();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 3 state
  const [assignTo, setAssignTo] = useState<string[]>(["Sales"]);
  const [teamSales, setTeamSales] = useState<string[]>(["All"]);
  const [teamOps, setTeamOps] = useState<string[]>(["All"]);

  useEffect(() => {
    if (!open) return;
    setFile(undefined);
    setCurrentStep(0);
    setAssignTo(["Sales"]);
    setTeamSales(["All"]);
    setTeamOps(["All"]);
    
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
          title="Import Leads"
          iconSrc="/images/dashboard/inquiries/inquiries.svg"
          onClose={onClose}
        />

        {/* Content */}
        <div className={styles.content}>
          {/* Stepper */}
          <IconStepper
            steps={[
              { label: "Upload Excel File", iconSrc: "/images/dashboard/steps/upload.svg" },
              { label: "Validation Review", iconSrc: "/images/dashboard/steps/scan.svg" },
              { label: "Assign Leads", iconSrc: "/images/dashboard/steps/user-edit.svg" }
            ]}
            currentStep={currentStep}
          />

          {currentStep === 0 && (
            <div className={styles.uploadContainer}>
              <div className={styles.uploadTitle}>
                Attachment
              </div>
              <div className={styles.uploadArea}>
                <UploadDropzone
                  value={file}
                  onFileSelect={setFile}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.statsContainer}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Total Records</span>
                <span className={styles.statValue}>480</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Valid</span>
                <span className={styles.statValue}>470</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Duplicates</span>
                <div className={styles.statPill}>
                  <span className={styles.statPillText}>0</span>
                </div>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Invalid</span>
                <div className={styles.statPill}>
                  <span className={styles.statPillText}>0</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.assignContainer}>
              <DashboardField
                control="select"
                variant="modal"
                multiple
                label="Assign To"
                value={assignTo}
                options={[
                  { label: "Sales", value: "Sales" },
                  { label: "Marketing", value: "Marketing" },
                  { label: "Operations", value: "Operations" },
                ]}
                onChange={(e) => setAssignTo(e.target.value as unknown as string[])}
              />
              <DashboardField
                control="select"
                variant="modal"
                multiple
                label="Team Members ( Sales )"
                value={teamSales}
                options={[
                  { label: "All", value: "All" },
                  { label: "User 1", value: "User 1" },
                  { label: "User 2", value: "User 2" },
                ]}
                onChange={(e) => setTeamSales(e.target.value as unknown as string[])}
              />
              <DashboardField
                control="select"
                variant="modal"
                multiple
                label="Team Members ( Operation )"
                value={teamOps}
                options={[
                  { label: "All", value: "All" },
                  { label: "User 3", value: "User 3" },
                  { label: "User 4", value: "User 4" },
                ]}
                onChange={(e) => setTeamOps(e.target.value as unknown as string[])}
              />
              <div className={styles.infoAlert}>
                <div className={styles.infoAlertIcon}>!</div>
                <span className={styles.infoAlertText}>Leads will be distributed equally among selected team members.</span>
              </div>
            </div>
          )}
        </div>

        <ModalFooter
          primaryLabel={currentStep === 2 ? "Assign Leads" : "Next"}
          primaryOnClick={() => {
            if (currentStep === 0) {
              if (file) setCurrentStep(1);
            } else if (currentStep === 1) {
              setCurrentStep(2);
            } else {
              onSuccess();
            }
          }}
          primaryDisabled={currentStep === 0 && !file}
          secondaryLabel={currentStep === 0 ? "Cancel" : "Previous"}
          secondaryOnClick={() => {
            if (currentStep === 0) {
              onClose();
            } else {
              setCurrentStep(currentStep - 1);
            }
          }}
        />

      </div>
    </div>
  );
}

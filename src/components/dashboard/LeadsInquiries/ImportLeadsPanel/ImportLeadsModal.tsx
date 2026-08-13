"use client";

import React, { useState, useEffect } from "react";
import { UploadDropzone } from "@/components/dashboard/FormFields/UploadDropzone";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { IconStepper } from "@/components/shared";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { importAdminLeads } from "@/services/admin/adminLeadsService";
import { mutate as globalMutate } from "swr";
import styles from "./ImportLeadsModal.module.scss";

interface ValidationSummary {
  total: number;
  valid: number;
  duplicate_in_file: number;
  duplicate_existing: number;
  invalid: number;
}

interface ImportLeadsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportLeadsModal({ open, onClose, onSuccess }: ImportLeadsModalProps) {
  const [file, setFile] = useState<File | undefined>();
  const [fileError, setFileError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Step 2 — assign
  const [assignTo, setAssignTo] = useState<string[]>(["Sales"]);
  const [teamSales, setTeamSales] = useState<string[]>(["All"]);
  const [teamOps, setTeamOps] = useState<string[]>(["All"]);

  const { data: usersData } = useAdminUsers({ limit: 100 });
  const users = usersData?.results || [];

  const salesUsers = users.filter((u: any) => u.role_label?.toLowerCase().includes("sales"));
  const opsUsers = users.filter((u: any) => u.role_label?.toLowerCase().includes("operation"));

  useEffect(() => {
    if (!open) return;
    setFile(undefined);
    setFileError(null);
    setCurrentStep(0);
    setAssignTo(["Sales"]);
    setTeamSales(["All"]);
    setTeamOps(["All"]);
    setIsSubmitting(false);
    setValidationSummary(null);
    setImportError(null);

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

  const buildAssigneeIds = (): number[] => {
    let assignees: number[] = [];
    if (teamSales.includes("All")) {
      assignees = [...assignees, ...salesUsers.map((u: any) => u.id)];
    } else {
      assignees = [...assignees, ...teamSales.map((id) => parseInt(id))];
    }
    if (teamOps.includes("All")) {
      assignees = [...assignees, ...opsUsers.map((u: any) => u.id)];
    } else {
      assignees = [...assignees, ...teamOps.map((id) => parseInt(id))];
    }
    return Array.from(new Set(assignees));
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Go to assign step
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Assign step → call API, then show validation
      if (!file) return;
      setIsSubmitting(true);
      setImportError(null);
      try {
        const assignees = buildAssigneeIds();
        const result = await importAdminLeads(file, assignees.length > 0 ? assignees : [-1]);
        setValidationSummary(result.validation);
        // Revalidate import batches list in background
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeadImportBatches", undefined, { revalidate: true });
        setCurrentStep(2);
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || "Import failed. Please try again.";
        setImportError(message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Step 2 (validation review) → done
      onSuccess();
    }
  };

  const primaryLabel = () => {
    if (currentStep === 2) return "Done";
    if (isSubmitting) return "Importing...";
    if (currentStep === 1) return "Import & Validate";
    return "Next";
  };

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
              { label: "Assign Leads", iconSrc: "/images/dashboard/steps/user-edit.svg" },
              { label: "Validation Review", iconSrc: "/images/dashboard/steps/scan.svg" },
            ]}
            currentStep={currentStep}
          />

          {/* Step 0 — Upload */}
          {currentStep === 0 && (
            <div className={styles.uploadContainer}>
              <div className={styles.uploadTitle}>Attachment</div>
              <div className={styles.uploadArea}>
                <UploadDropzone
                  value={file}
                  onFileSelect={(selected) => {
                    if (!selected) {
                      setFile(undefined);
                      setFileError(null);
                      return;
                    }
                    const isCSV =
                      selected.type === "text/csv" ||
                      selected.name.toLowerCase().endsWith(".csv");
                    if (!isCSV) {
                      setFile(undefined);
                      setFileError("Only CSV files are supported. Please upload a .csv file.");
                    } else {
                      setFile(selected);
                      setFileError(null);
                    }
                  }}
                  accept=".csv"
                />
              </div>
              {fileError && (
                <div className={styles.errorAlert}>{fileError}</div>
              )}
            </div>
          )}

          {/* Step 1 — Assign */}
          {currentStep === 1 && (
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
                  ...salesUsers.map((u: any) => ({ label: u.full_name, value: u.id.toString() }))
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
                  ...opsUsers.map((u: any) => ({ label: u.full_name, value: u.id.toString() }))
                ]}
                onChange={(e) => setTeamOps(e.target.value as unknown as string[])}
              />
              <div className={styles.infoAlert}>
                <div className={styles.infoAlertIcon}>!</div>
                <span className={styles.infoAlertText}>Leads will be distributed equally among selected team members.</span>
              </div>
              {importError && (
                <div className={styles.errorAlert}>{importError}</div>
              )}
            </div>
          )}

          {/* Step 2 — Validation Review */}
          {currentStep === 2 && validationSummary && (
            <div className={styles.statsContainer}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Total Records</span>
                <span className={styles.statValue}>{validationSummary.total}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Valid</span>
                <span className={styles.statValue}>{validationSummary.valid}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Duplicates (in file)</span>
                <div className={styles.statPill}>
                  <span className={styles.statPillText}>{validationSummary.duplicate_in_file}</span>
                </div>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Duplicates (existing)</span>
                <div className={styles.statPill}>
                  <span className={styles.statPillText}>{validationSummary.duplicate_existing}</span>
                </div>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Invalid</span>
                <div className={styles.statPill}>
                  <span className={styles.statPillText}>{validationSummary.invalid}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <ModalFooter
          primaryLabel={primaryLabel()}
          primaryOnClick={handleNext}
          primaryDisabled={(currentStep === 0 && (!file || !!fileError)) || isSubmitting}
          secondaryLabel={currentStep === 0 ? "Cancel" : currentStep === 2 ? "Close" : "Previous"}
          secondaryOnClick={() => {
            if (currentStep === 0 || currentStep === 2) {
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

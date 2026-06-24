import React, { useState, useEffect } from "react";
import DashboardField from "@/components/shared/DashboardField/DashboardField";
import { ModalHeader, ModalFooter } from "@/components/shared";
import styles from "./ReassignLeadModal.module.scss";

interface ReassignLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReassignLeadModal({ open, onClose, onSuccess }: ReassignLeadModalProps) {
  const [assignTo, setAssignTo] = useState<string[]>(["Sales"]);
  const [teamSales, setTeamSales] = useState<string[]>(["All"]);
  const [teamOps, setTeamOps] = useState<string[]>(["All"]);

  useEffect(() => {
    if (!open) return;
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
          title="Reassign Lead"
          iconSrc="/images/dashboard/assign.svg"
          onClose={onClose}
        />

        <div className={styles.content}>
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
        </div>

        <ModalFooter
          primaryLabel="Assign Leads"
          primaryOnClick={onSuccess}
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
        />
      </div>
    </div>
  );
}

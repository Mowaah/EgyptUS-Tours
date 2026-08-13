"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./ReassignModal.module.scss";

export interface Agent {
  id: string;
  name: string;
  avatarSrc: string;
}

interface ReassignModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (agentId: string, reason?: string) => void;
  agents?: Agent[];
  title?: string;
  subtitle?: string;
  showReasonField?: boolean;
}

const DEFAULT_AGENTS: Agent[] = [
  { id: "1", name: "Ahmed Hassan", avatarSrc: "/images/dashboard/sara.jpg" },
  { id: "2", name: "Sara M.", avatarSrc: "/images/dashboard/sara.jpg" },
  { id: "3", name: "John Doe", avatarSrc: "/images/dashboard/sara.jpg" },
];

export default function ReassignModal({
  open,
  onClose,
  onConfirm,
  agents = DEFAULT_AGENTS,
  title = "Re-Assign To",
  subtitle = "Choose an agent to handle this request",
  showReasonField = false,
}: ReassignModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (isDropdownOpen && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: 'fixed',
          top: `${rect.bottom + 4}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          zIndex: 10000,
        });
      }
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!open) return;
    // reset selection when opened
    setSelectedAgentId("");
    setReason("");
    setError("");
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
  }, [open, onClose, agents]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!open) return null;

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reassign-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ModalHeader
          onClose={onClose}
          iconSrc="/images/dashboard/user-add.svg"
          title={title}
          subtitle={subtitle}
          id="reassign-modal-title"
        />

        <div className={styles.body}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Agent</label>
            <div className={styles.selectContainer} ref={dropdownRef}>
              <div 
                className={`${styles.selectWrapper} ${isDropdownOpen ? styles.isOpen : ""}`}
                tabIndex={0} 
                role="button" 
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setIsDropdownOpen(!isDropdownOpen);
                    e.preventDefault();
                  }
                }}
              >
                <div className={styles.selectContent}>
                  {selectedAgent ? (
                    <>
                      <img
                        src={selectedAgent.avatarSrc}
                        alt={selectedAgent.name}
                        width={32}
                        height={32}
                        className={styles.avatar}
                      />
                      <span className={styles.selectValue}>{selectedAgent.name}</span>
                    </>
                  ) : (
                    <span className={styles.selectValue} style={{ color: "var(--ds-gray-400, #9ca3af)" }}>Select an agent...</span>
                  )}
                </div>
                <div className={`${styles.arrowIcon} ${isDropdownOpen ? styles.arrowUp : ""}`} aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {isDropdownOpen && typeof document !== "undefined" && createPortal(
                <ul 
                  className={styles.dropdownMenu} 
                  role="listbox" 
                  style={dropdownStyle}
                  ref={dropdownMenuRef}
                >
                  {agents.map(agent => (
                    <li 
                      key={agent.id}
                      className={`${styles.dropdownItem} ${selectedAgentId === agent.id ? styles.selected : ''}`}
                      role="option"
                      aria-selected={selectedAgentId === agent.id}
                      onClick={() => {
                        setSelectedAgentId(agent.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <img
                        src={agent.avatarSrc}
                        alt={agent.name}
                        width={32}
                        height={32}
                        className={styles.avatar}
                      />
                      <span className={styles.selectValue}>{agent.name}</span>
                    </li>
                  ))}
                </ul>,
                document.body
              )}
            </div>
          </div>

          {showReasonField && (
            <div className={styles.fieldGroup} style={{ marginTop: '16px' }}>
              <DashboardField
                control="textarea"
                id="reason-for-reassign"
                label="Reason for Re-Assign"
                variant="modal"
                placeholder="Enter the reason for re-assign this request..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                error={error}
                style={{ minHeight: "120px", resize: "none" }}
              />
            </div>
          )}
        </div>

        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel="Confirm"
          primaryOnClick={() => {
            if (showReasonField && !reason.trim()) {
              setError("Reason is required.");
              return;
            }
            onConfirm(selectedAgentId, reason);
          }}
        />
      </section>
    </div>
  );
}

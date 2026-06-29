"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";;
import styles from "./ReassignModal.module.scss";

export interface Agent {
  id: string;
  name: string;
  avatarSrc: string;
}

interface ReassignModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (agentId: string) => void;
  agents?: Agent[];
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
}: ReassignModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (isDropdownOpen && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownStyle({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
        });
      }
    };
    updatePosition();
    if (isDropdownOpen) {
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!open) return;
    // reset selection to first agent when opened (or keep it if you prefer)
    setSelectedAgentId(agents[0]?.id || "");
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

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

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
          title="Re-Assign To"
          subtitle="Choose an agent to handle this request"
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
                  {selectedAgent && (
                    <>
                      <Image
                        src={selectedAgent.avatarSrc}
                        alt={selectedAgent.name}
                        width={32}
                        height={32}
                        className={styles.avatar}
                      />
                      <span className={styles.selectValue}>{selectedAgent.name}</span>
                    </>
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
                      <Image
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
        </div>

        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel="Confirm"
          primaryOnClick={() => onConfirm(selectedAgentId)}
        />
      </section>
    </div>
  );
}

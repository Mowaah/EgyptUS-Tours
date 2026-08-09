"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AdditionalServiceCard.module.scss";

export interface AdditionalService {
  id: string;
  name: string;
  translations?: Record<string, string>;
  price: string;
}

interface AdditionalServiceCardProps {
  service: AdditionalService;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AdditionalServiceCard({ service, onEdit, onDelete }: AdditionalServiceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3 className={styles.title}>{service.name}</h3>
        <span className={styles.price}>{service.price}</span>
      </div>
      
      <div className={styles.menuContainer} ref={menuRef}>
        <button 
          type="button"
          className={`${styles.menuButton} ${menuOpen ? styles.menuButtonActive : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="More options"
        >
          <span className={styles.moreIcon} />
        </button>

        {menuOpen && (
          <div className={styles.dropdownMenu}>
            <button 
              type="button" 
              className={styles.menuItem}
              onClick={() => {
                setMenuOpen(false);
                onEdit(service.id);
              }}
            >
              <span
                className={styles.actionIcon}
                style={{
                  maskImage: 'url(/images/dashboard/edit.svg)',
                  WebkitMaskImage: 'url(/images/dashboard/edit.svg)',
                }}
                aria-hidden
              />
              <span>Edit</span>
            </button>
            <button 
              type="button" 
              className={styles.menuItemDanger}
              onClick={() => {
                setMenuOpen(false);
                onDelete(service.id);
              }}
            >
              <span
                className={styles.actionIcon}
                style={{
                  maskImage: 'url(/images/dashboard/delete.svg)',
                  WebkitMaskImage: 'url(/images/dashboard/delete.svg)',
                }}
                aria-hidden
              />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

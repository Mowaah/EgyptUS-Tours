"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import styles from "./DestinationCard.module.scss";

export interface Destination {
  id: string;
  name: string;
  imageSrc: string;
}

interface DestinationCardProps {
  destination: Destination;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DestinationCard({ destination, onEdit, onDelete }: DestinationCardProps) {
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
      <div className={styles.imageWrapper}>
        <Image 
          src={destination.imageSrc} 
          alt={destination.name}
          fill
          className={styles.image}
        />
        
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
                  onEdit(destination.id);
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
                  onDelete(destination.id);
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
      <h3 className={styles.title}>{destination.name}</h3>
    </div>
  );
}

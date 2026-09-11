"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./DestinationCard.module.scss";

export interface Destination {
  id: string;
  name: string;
  translations?: Record<string, string>;
  imageSrc: string;
}

export interface DestinationCardProps {
  destination: Destination;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export default function DestinationCard({
  destination,
  onEdit,
  onDelete,
  isDragging = false,
  isOverlay = false,
  dragHandleProps,
}: DestinationCardProps) {
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
    <div
      className={`${styles.card} ${isDragging ? styles.cardDragging : ""} ${isOverlay ? styles.cardOverlay : ""}`}
      {...dragHandleProps}
    >
      <div className={styles.imageWrapper}>
        <Image 
          src={destination.imageSrc} 
          alt={destination.name}
          fill
          className={styles.image}
        />
      </div>

      {!isOverlay && onEdit && onDelete && (
        <div
          className={styles.menuContainer}
          ref={menuRef}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
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
      )}

      <h3 className={styles.title}>{destination.name}</h3>
    </div>
  );
}

export function SortableDestinationCard(props: DestinationCardProps & { disabled?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.destination.id,
    disabled: props.disabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.sortableWrapper}>
      <DestinationCard
        {...props}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

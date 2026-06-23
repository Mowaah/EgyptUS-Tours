import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import Image from "next/image";
import styles from "./KeywordsField.module.scss";

interface KeywordsFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxKeywords?: number;
  error?: string;
}

export function KeywordsField({
  label,
  placeholder = "Separate keywords using 10 commas",
  value = "",
  onChange,
  maxKeywords = 10,
  error,
}: KeywordsFieldProps) {
  const [inputValue, setInputValue] = useState("");
  
  const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && tags.length < maxKeywords && !tags.includes(trimmed)) {
      onChange?.(tags.concat(trimmed).join(','));
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onChange?.(tags.filter(tag => tag !== tagToRemove).join(','));
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputRow}>
        <div className={styles.inputColumn}>
          <div className={`${styles.inputWrapper} ${error ? styles.error : ""}`}>
            <input
              type="text"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={styles.input}
              disabled={tags.length >= maxKeywords}
            />
          </div>
          <div className={styles.counterRow}>
            {error && <span className={styles.errorText}>{error}</span>}
            <span className={styles.counter}>{tags.length}/{maxKeywords}</span>
          </div>
        </div>
        <button 
          type="button" 
          className={styles.addBtn} 
          onClick={handleAdd} 
          disabled={tags.length >= maxKeywords || !inputValue.trim()}
          aria-label="Add keyword"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {tags.map((tag) => (
            <div key={tag} className={styles.tag}>
              <span className={styles.tagIcon}>
                <Image src="/images/dashboard/tag.svg" alt="" width={18} height={18} aria-hidden />
              </span>
              <span className={styles.tagText}>{tag}</span>
              <button type="button" className={styles.removeBtn} onClick={() => handleRemove(tag)} aria-label={`Remove ${tag}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.17 14.83L14.83 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.83 14.83L9.17 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

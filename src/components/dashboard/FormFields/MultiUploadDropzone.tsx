"use client";

import React, { useRef } from "react";
import Image from "next/image";
import styles from "./FormFields.module.scss";

interface MultiUploadDropzoneProps {
  values?: any[];
  onFilesChange?: (files: any[]) => void;
  accept?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function MultiUploadDropzone({ 
  values = [], 
  onFilesChange, 
  accept = "image/png, image/jpeg, image/gif", 
  className = "",
  title = "Click to upload",
  subtitle = "PNG, JPG, GIF up to 10MB"
}: MultiUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFilesChange) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...values, ...newFiles]);
    }
    // Reset input so the same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    if (onFilesChange) {
      const newValues = [...values];
      newValues.splice(index, 1);
      onFilesChange(newValues);
    }
  };

  return (
    <div className={`${styles.multiUploadWrapper} ${className}`}>
      {/* Upload Button/Dropzone (Dashed Box) */}
      <div className={styles.multiDropzoneBox} onClick={handleClick} role="button" tabIndex={0}>
        <input
          type="file"
          ref={inputRef}
          accept={accept}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
        />
        <div className={styles.multiDropzoneContent}>
          <Image src="/images/dashboard/fields/document-upload.svg" alt="" width={32} height={32} aria-hidden style={{ opacity: 0.4 }} />
          <p className={styles.multiDropzoneTitle}>{title}</p>
          <p className={styles.multiDropzoneSubtitle}>{subtitle}</p>
        </div>
      </div>

      {/* Thumbnails (Below the dropzone) */}
      {values.length > 0 && (
        <div className={styles.multiThumbnailList}>
          {values.map((file, index) => {
            const fileObj = typeof file === "object" && file !== null && !(file instanceof File) && "file" in file ? file.file : file;
            const isFileObject = fileObj instanceof File;
            const objectUrl = isFileObject ? URL.createObjectURL(fileObj as File) : (fileObj as string);
            
            return (
              <div key={index} className={styles.multiThumbnailWrapper}>
                <div className={styles.multiThumbnailHeader}>
                  <span className={styles.multiThumbnailTitle}>Image {index + 1}</span>
                </div>
                <div 
                  className={styles.multiThumbnailBox} 
                  style={{ backgroundImage: `url(${objectUrl})` }}
                >
                  <button type="button" className={styles.multiThumbnailDelete} onClick={(e) => { e.stopPropagation(); handleRemove(index); }}>
                    <Image src="/images/dashboard/delete.svg" alt="Delete" width={12} height={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

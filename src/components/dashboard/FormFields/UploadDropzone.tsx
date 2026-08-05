"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import styles from "./FormFields.module.scss";

interface UploadDropzoneProps {
  value?: File | string;
  onFileSelect?: (file: File | undefined) => void;
  accept?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  maxSizeBytes?: number;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function UploadDropzone({ 
  value, 
  onFileSelect, 
  accept = "image/png, image/jpeg, image/gif", 
  className = "",
  title = "Click to upload an image or drag & drop",
  subtitle = "PNG, JPG, GIF up to 10MB",
  maxSizeBytes,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = React.useState(100);
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Fake upload progress simulation
  React.useEffect(() => {
    if (value && typeof value !== 'string') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 50); // 500ms total
      return () => clearInterval(interval);
    }
  }, [value]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so the same file can be re-selected after removal
    e.target.value = "";
    if (!file || !onFileSelect) return;
    if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
      const limitMB = Math.round(maxSizeBytes / (1024 * 1024));
      setSizeError(`"${file.name}" is too large. Maximum size is ${limitMB} MB.`);
      return;
    }
    setSizeError(null);
    onFileSelect(file);
  };

  return (
    <div className={styles.uploadContainer}>
      {!value && (
        <div className={`${styles.dropzone} ${className}`} onClick={handleClick} role="button" tabIndex={0}>
          <input
            type="file"
            ref={inputRef}
            accept={accept}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className={styles.dropzoneContent}>
            <Image src="/images/dashboard/fields/document-upload.svg" alt="" width={32} height={32} aria-hidden style={{ opacity: 0.4 }} />
            <p className={styles.dropzoneTitle}>{title}</p>
            <p className={styles.dropzoneSubtitle}>{subtitle}</p>
          </div>
        </div>
      )}

      {value && (
        <div className={styles.fileItem}>
          <div className={styles.fileIconWrapper}>
            {typeof value === 'string' ? (
              value.endsWith('.pdf') ? (
                <Image src="/images/dashboard/file/pdf.svg" alt="PDF" width={40} height={40} />
              ) : (
                <Image src="/images/dashboard/file/png.svg" alt="PNG" width={40} height={40} />
              )
            ) : value.type === "application/pdf" || value.name.endsWith('.pdf') ? (
              <Image src="/images/dashboard/file/pdf.svg" alt="PDF" width={40} height={40} />
            ) : (
              <Image src="/images/dashboard/file/png.svg" alt="PNG" width={40} height={40} />
            )}
          </div>
          
          <div className={styles.fileInfo}>
            <p className={styles.fileName}>
              {typeof value === 'string' ? value.split('/').pop() : value.name}
            </p>
            <div className={styles.fileMeta}>
              {typeof value === 'string' ? (
                <span className={styles.fileSize}>Uploaded Image</span>
              ) : (
                <>
                  <span className={styles.fileSize}>{formatBytes(value.size)} of {formatBytes(value.size)}</span>
                  <div className={styles.fileDivider}></div>
                  <span className={styles.fileStatus}>
                    {progress === 100 ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33334 8 1.33334C4.3181 1.33334 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="#079455" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.33333 8.00001L7.11111 9.77779L10.6667 6.22223" stroke="#079455" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Complete
                      </>
                    ) : (
                      <span style={{ color: '#606978' }}>Uploading...</span>
                    )}
                  </span>
                </>
              )}
            </div>
            {typeof value !== 'string' && (
              <div className={styles.fileProgressWrapper}>
                <div className={styles.fileProgressBar}>
                  <div className={styles.fileProgressFill} style={{ width: `${progress}%` }}></div>
                </div>
                <span className={styles.fileProgressPercentage}>{progress}%</span>
              </div>
            )}
          </div>

          <button 
            type="button" 
            className={styles.fileDeleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect?.(undefined);
            }}
          >
            <Image src="/images/dashboard/delete.svg" alt="Delete" width={20} height={20} />
          </button>
        </div>
      )}
      {sizeError && (
        <SuccessModal
          variant="error"
          title="Image Too Large"
          message={sizeError}
          hideSecondaryButton
          primaryButtonText="Try again"
          onClose={() => setSizeError(null)}
          onPrimaryClick={() => {
            setSizeError(null);
            inputRef.current?.click();
          }}
        />
      )}
    </div>
  );
}

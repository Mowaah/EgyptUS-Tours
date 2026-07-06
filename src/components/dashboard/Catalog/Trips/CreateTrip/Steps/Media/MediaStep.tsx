import React, { useState } from "react";
import Image from "next/image";
import { FormSection, FormSpec, UploadDropzone } from "@/components/dashboard/FormFields";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./MediaStep.module.scss";

interface MediaUploadBlockProps {
  title: string;
  attachmentLabel?: string;
  onDelete?: () => void;
  onAdd?: () => void;
  defaultFileMock?: boolean;
}

function MediaUploadBlock({ 
  title, 
  attachmentLabel = "Attachment [800 x 552]",
  onDelete,
  onAdd,
  defaultFileMock = false
}: MediaUploadBlockProps) {
  const [file, setFile] = useState<File | string | undefined>(defaultFileMock ? { name: 'Description of the problem.png', size: 200000 } as any : undefined);
  const [lang, setLang] = useState<Language>("English");
  
  let headerAction = null;
  if (onDelete) {
    headerAction = (
      <button type="button" className={styles.iconBtnDelete} onClick={onDelete}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.83333 17.5C5.375 17.5 4.98264 17.3368 4.65625 17.0104C4.32986 16.684 4.16667 16.2917 4.16667 15.8333V5H3.33333V3.33333H7.5V2.5H12.5V3.33333H16.6667V5H15.8333V15.8333C15.8333 16.2917 15.6701 16.684 15.3438 17.0104C15.0174 17.3368 14.625 17.5 14.1667 17.5H5.83333ZM14.1667 5H5.83333V15.8333H14.1667V5ZM7.5 14.1667H9.16667V6.66667H7.5V14.1667ZM10.8333 14.1667H12.5V6.66667H10.8333V14.1667Z" fill="#F04438"/>
        </svg>
      </button>
    );
  } else if (onAdd) {
    headerAction = (
      <button type="button" className={styles.iconBtnAdd} onClick={onAdd}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.16667 10.8333H4.16667V9.16667H9.16667V4.16667H10.8333V9.16667H15.8333V10.8333H10.8333V15.8333H9.16667V10.8333Z" fill="white"/>
        </svg>
      </button>
    );
  }
  
  return (
    <FormSection 
      title={title} 
      iconSrc="/images/dashboard/fields/document-upload.svg" 
      headerAction={headerAction}
      className={styles.card}
    >
      <div className={styles.dropzoneWrap}>
        <div className={styles.attachmentLabelWrap}>
          <p className={styles.attachmentLabel}>{attachmentLabel}</p>
        </div>
        <UploadDropzone value={file as any} onFileSelect={(f) => setFile(f)} />
      </div>
      
      <FormSpec>
        <LanguageTabs active={lang} onChange={setLang} className={styles.whiteTabs} />
        <div className={styles.fieldRow}>
          <DashboardField label="Image Title" placeholder="Image Title..." />
          <DashboardField label="Image Alt" placeholder="Comma-separated tags (e.g. egypt, travel, cairo)" />
        </div>
      </FormSpec>
    </FormSection>
  );
}

export function MediaStep() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <MediaUploadBlock title="Upload Thumbnail" />
        <MediaUploadBlock title="Upload Image" />
        <MediaUploadBlock title="Photo Gallery 2" />
        <MediaUploadBlock title="Photo Gallery 3" />
        <MediaUploadBlock title="Photo Gallery 4" />
        <MediaUploadBlock title="Photo Gallery 5" />
        <MediaUploadBlock title="Photo Gallery 6" onDelete={() => {}} />
        <MediaUploadBlock title="Photo Gallery 7" onAdd={() => {}} />
      </div>
    </div>
  );
}

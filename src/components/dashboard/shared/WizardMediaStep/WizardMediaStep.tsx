import React, { useState } from "react";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { FormSection, FormSpec, UploadDropzone } from "@/components/dashboard/FormFields";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./WizardMediaStep.module.scss";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface MediaUploadBlockProps {
  index: number;
  title: string;
  attachmentLabel?: string;
  onDelete?: () => void;
  defaultFileMock?: boolean;
}

function MediaUploadBlock({ 
  index,
  title, 
  attachmentLabel = "Attachment [1100 x 552]",
  onDelete,
  defaultFileMock = false
}: MediaUploadBlockProps) {
  const [lang, setLang] = useState<Language>("English");
  const { control, register, setValue } = useFormContext();

  let headerAction = null;
  if (onDelete) {
    headerAction = (
      <button type="button" className={styles.iconBtnDelete} onClick={onDelete} title="Delete image">
        <Image src="/images/dashboard/delete.svg" alt="Delete" width={20} height={20} />
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
        <Controller
          name={`photos.${index}.file` as never}
          control={control}
          render={({ field }) => (
            <UploadDropzone
              value={field.value || (defaultFileMock ? ({ name: "Description of the problem.png", size: 200000 } as File) : undefined)}
              onFileSelect={(file) => {
                if (!file) {
                  setValue(`photos.${index}.id` as never, undefined as never, { shouldDirty: true });
                }
                field.onChange(file);
              }}
              accept="image/png, image/jpeg, image/webp"
              subtitle="PNG, JPG, WEBP up to 5MB"
              maxSizeBytes={MAX_IMAGE_BYTES}
            />
          )}
        />
      </div>
      
      <FormSpec>
        <LanguageTabs active={lang} onChange={setLang} className={styles.whiteTabs} />
        <div className={styles.fieldRow}>
          <DashboardField label="Image Title" placeholder="Image Title..." {...register(`photos.${index}.title` as never)} />
          <DashboardField label="Image Alt" placeholder="Comma-separated tags (e.g. egypt, travel, cairo)" {...register(`photos.${index}.alt` as never)} />
        </div>
      </FormSpec>
    </FormSection>
  );
}

export default function WizardMediaStep() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  const rawPhotoError = errors.photos as { root?: { message?: string }; message?: string } | undefined;
  const photosErrorMessage = rawPhotoError?.root?.message || rawPhotoError?.message;

  React.useEffect(() => {
    if (photosErrorMessage && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [photosErrorMessage]);

  const handleAddPhoto = () => {
    append({ file: undefined, title: "", alt: "" });
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Image src="/images/dashboard/catalog/trips/media.svg" alt="Media" width={20} height={20} />
          </div>
          <h2 className={styles.title}>Media</h2>
        </div>
        <button type="button" className={styles.addBtn} onClick={handleAddPhoto} title="Add image">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.16667 10.8333H4.16667V9.16667H9.16667V4.16667H10.8333V9.16667H15.8333V10.8333H10.8333V15.8333H9.16667V10.8333Z" fill="white"/>
          </svg>
        </button>
      </div>

      {photosErrorMessage && (
        <div className={styles.errorText} role="alert">
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{photosErrorMessage}</span>
        </div>
      )}

      <div className={styles.grid}>
        {fields.map((field, index) => {
          let title = `Photo Gallery ${index}`;
          let attachmentLabel = "Attachment [1100 x 552]";
          if (index === 0) {
            title = "Upload Thumbnail";
            attachmentLabel = "Attachment [302 x 202]";
          } else if (index === 1) {
            title = "Upload Image";
          }

          // Show delete button for any cards added beyond default 6 (index >= 6)
          const onDelete = index >= 6 ? () => remove(index) : undefined;

          return (
            <MediaUploadBlock
              key={field.id}
              index={index}
              title={title}
              attachmentLabel={attachmentLabel}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </div>
  );
}

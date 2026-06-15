"use client";

import React, { useState, useEffect } from "react";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/shared/DashboardField/DashboardField";
import {
  FormSection,
  FormSpec,
  UploadDropzone,
  RichTextField,
  ToggleField,
} from "@/components/dashboard/FormFields";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomDatePicker from "@/components/shared/CustomDatePicker/CustomDatePicker";
import CreateCategoryModal from "./CreateCategoryModal/CreateCategoryModal";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import { createPostSchema, type CreatePostValues } from "./CreatePostSchema";
import styles from "./CreatePost.module.scss";

export function CreatePost() {
  const [thumbnailLang, setThumbnailLang] = useState<Language>("English");
  const [imageLang, setImageLang] = useState<Language>("English");
  const [contentLang, setContentLang] = useState<Language>("English");
  const [detailsLang, setDetailsLang] = useState<Language>("English");
  const [seoLang, setSeoLang] = useState<Language>("English");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([
    { label: "Adventure Tours", value: "adventure-tours" },
    { label: "Luxury Hotels", value: "luxury-hotels" }
  ]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      autoApply: false,
    },
  });

  const onSubmit = (data: CreatePostValues) => {
    console.log("Form Payload:", data);
    alert("Payload logged to console! Check devtools.");
  };

  return (
    <form id="create-post-form" className={styles.page} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.mainColumn}>
        <FormSection title="Upload Thumbnail" iconSrc="/images/dashboard/fields/document-upload.svg">
          <FormSpec>
            <Controller
              name="thumbnailFile"
              control={control}
              render={({ field }) => (
                <UploadDropzone onFileSelect={field.onChange} value={field.value} />
              )}
            />
            <LanguageTabs active={thumbnailLang} onChange={setThumbnailLang} className={styles.whiteTabs} />
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <DashboardField label="Thumbnail Title" placeholder="Thumbnail Title..." {...register("thumbnailTitle")} error={errors.thumbnailTitle?.message} />
              <DashboardField label="Thumbnail Alt" placeholder="Comma-separated tags (e.g. egypt, travel, cairo)" {...register("thumbnailAlt")} error={errors.thumbnailAlt?.message} />
            </div>
          </FormSpec>
        </FormSection>

        <FormSection title="Upload Image" iconSrc="/images/dashboard/fields/document-upload.svg">
          <FormSpec>
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <UploadDropzone onFileSelect={field.onChange} value={field.value} />
              )}
            />
            <LanguageTabs active={imageLang} onChange={setImageLang} className={styles.whiteTabs} />
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <DashboardField label="Image Title" placeholder="Image Title..." {...register("imageTitle")} error={errors.imageTitle?.message} />
              <DashboardField label="Image Alt" placeholder="Comma-separated tags (e.g. egypt, travel, cairo)" {...register("imageAlt")} error={errors.imageAlt?.message} />
            </div>
          </FormSpec>
        </FormSection>

        <FormSection title="Blog Content" iconSrc="/images/dashboard/fields/blog-content.svg">
          <FormSpec>
            <LanguageTabs active={contentLang} onChange={setContentLang} className={styles.whiteTabs} />
            <DashboardField label="Title" placeholder="e.g. Summer Special 20% Off ..." {...register("title")} error={errors.title?.message} />
            <DashboardField
              control="textarea"
              label="Short Description"
              placeholder="Brief summary shown in listings (max 300 chars)..."
              maxLength={300}
              {...register("shortDescription")}
              error={errors.shortDescription?.message}
            />
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextField label="Content" value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content && <span style={{ color: "#EF4444", fontSize: "0.875rem" }}>{errors.content.message}</span>}
          </FormSpec>
        </FormSection>
      </div>

      <div className={styles.sideColumn}>
        <FormSection title="Publish Settings" iconSrc="/images/dashboard/fields/publish-settings.svg">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
            <FormSpec>
              <Controller
                name="scheduledDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    variant="custom"
                    value={field.value || ""}
                    onChange={field.onChange}
                    renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                        <DashboardField
                          label="Scheduled Date"
                          value={displayTxt || field.value || ""}
                          readOnly
                          placeholder="MM/DD/YYYY"
                          error={errors.scheduledDate?.message}
                          endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden style={{ pointerEvents: "none" }} />}
                          style={{ pointerEvents: "none" }}
                        />
                      </div>
                    )}
                  />
                )}
              />
            </FormSpec>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "10px 20px",
                gap: "10px",
                background: "#FBFBFB",
                border: "1px solid #F5F5F5",
                borderRadius: "24px",
                width: "100%",
              }}
            >
              <Controller
                name="autoApply"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <ToggleField
                    label="Auto-Apply"
                    description="Feature this post to increase its visibility across the platform"
                    checked={value}
                    onChange={onChange}
                    ref={ref}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Details" iconSrc="/images/dashboard/fields/details.svg">
          <FormSpec>
            <LanguageTabs active={detailsLang} onChange={setDetailsLang} className={styles.whiteTabs} />
            <Controller
              name="category"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DashboardField
                  control="select"
                  label="Category"
                  options={[
                    { label: "Select category...", value: "", disabled: true },
                    ...categories
                  ]}
                  value={value}
                  onChange={onChange}
                  error={errors.category?.message}
                />
              )}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "14px", color: "#4B5563" }}>Can&apos;t find your category?</span>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Create a new one.</span>
              </div>
              <button
                type="button"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "16px",
                  background: "#2971E6",
                  color: "white",
                  border: "none",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setIsCategoryModalOpen(true)}
              >
                +
              </button>
            </div>
          </FormSpec>
        </FormSection>

        <FormSection title="SEO Settings" iconSrc="/images/dashboard/fields/seo-settings.svg">
          <FormSpec>
            <LanguageTabs active={seoLang} onChange={setSeoLang} className={styles.whiteTabs} />
            <DashboardField label="Meta Title" placeholder="Meta Title..." {...register("metaTitle")} error={errors.metaTitle?.message} />
            <DashboardField
              control="textarea"
              label="Meta Description"
              placeholder="SEO description (max 300 char..."
              maxLength={300}
              {...register("metaDescription")}
              error={errors.metaDescription?.message}
            />
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <DashboardField label="Meta keywords" placeholder="Separate keywords using 10 commas" {...register("metaKeywords")} error={errors.metaKeywords?.message} />
              <DashboardField label="Slug" placeholder="e.g. your-page-url-slug" {...register("slug")} error={errors.slug?.message} />
            </div>
          </FormSpec>
        </FormSection>

        <FormSection title="Author" iconSrc="/images/dashboard/fields/author.svg">
          <FormSpec>
            <Controller
              name="author"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DashboardField
                  control="select"
                  label="Author"
                  options={[
                    { label: "Select Author .....", value: "", disabled: true },
                    { label: "John Doe", value: "john" },
                    { label: "Jane Smith", value: "jane" },
                  ]}
                  value={value}
                  onChange={onChange}
                  error={errors.author?.message}
                />
              )}
            />
          </FormSpec>
        </FormSection>
      </div>

      {showToast && (
        <DashboardStatusBanner
          message="The new category has been created and is now available for blog organization."
          variant="success"
          className={styles.toastBanner}
        />
      )}

      <CreateCategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        categories={categories}
        onCreate={(newCat) => {
          const newCategory = { label: newCat, value: newCat.toLowerCase().replace(/\s+/g, '-') };
          setCategories((prev) => [...prev, newCategory]);
          setShowToast(true);
        }} 
        onDelete={(catValue) => {
          setCategories((prev) => prev.filter((c) => c.value !== catValue));
        }}
      />
    </form>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
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
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { createPostSchema, type CreatePostValues } from "./CreatePostSchema";
import styles from "./CreatePost.module.scss";

export function CreatePost({ postId }: { postId?: string }) {
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
  const [showPublishModal, setShowPublishModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromList = searchParams?.get("from") === "list";





  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: postId ? {
      autoApply: false,
      title: "Top 10 Things to Do in Cairo",
      shortDescription: "Discover the vibrant culture and history of Egypt's capital city with our ultimate guide.",
      content: "<p>Cairo is a fascinating city...</p>",
      thumbnailTitle: "Cairo Skyline at Sunset",
      thumbnailAlt: "cairo, sunset, skyline, egypt",
      imageTitle: "Pyramids of Giza",
      imageAlt: "pyramids, giza, sphinx",
      scheduledDate: "10/25/2026",
      metaTitle: "Top 10 Things to Do in Cairo - EgyptUS Tours",
      metaDescription: "Explore the best activities in Cairo.",
      metaKeywords: "cairo, travel, activities",
      category: "adventure-tours",
      author: "Admin User"
    } : {
      autoApply: false,
    },
  });

  const onSubmit = (data: CreatePostValues) => {
    console.log("Form Payload:", data);
    if (postId) {
      if (fromList) {
        router.push(`/dashboard/marketing/articles?editSaved=true`);
      } else {
        router.push(`/dashboard/marketing/articles/${postId}?editSaved=true`);
      }
    } else {
      setShowPublishModal(true);
    }
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
            <div className={styles.fieldRow}>
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
            <div className={styles.fieldRow}>
              <DashboardField label="Image Title" placeholder="Image Title..." {...register("imageTitle")} error={errors.imageTitle?.message} />
              <DashboardField label="Image Alt" placeholder="Comma-separated tags (e.g. egypt, travel, cairo)" {...register("imageAlt")} error={errors.imageAlt?.message} />
            </div>
          </FormSpec>
        </FormSection>

        <FormSection title="Article Content" iconSrc="/images/dashboard/fields/article-content.svg">
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
                <RichTextField label="Content" value={field.value} onChange={field.onChange} error={errors.content?.message} />
              )}
            />
          </FormSpec>
        </FormSection>
      </div>

      <div className={styles.sideColumn}>
        <FormSection title="Publish Settings" iconSrc="/images/dashboard/fields/publish-settings.svg">
          <div className={styles.fieldColumn}>
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
                      <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                        <DashboardField
                          label="Scheduled Date"
                          value={displayTxt || field.value || ""}
                          readOnly
                          placeholder="MM/DD/YYYY"
                          error={errors.scheduledDate?.message}
                          endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden className={styles.iconOverlay} />}
                          className={styles.iconOverlay}
                        />
                      </div>
                    )}
                  />
                )}
              />
            </FormSpec>
            <div className={styles.toggleWrapper}>
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
            <div className={styles.createCategoryRow}>
              <div className={styles.createCategoryText}>
                <span className={styles.title}>Can&apos;t find your category?</span>
                <span className={styles.subtitle}>Create a new one.</span>
              </div>
              <button
                type="button"
                className={styles.createCategoryBtn}
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
            <div className={styles.fieldRow}>
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

      {showPublishModal && (
        <SuccessModal
          title="Post is Live"
          message="Your post has been successfully published and is now live on the platform, making it visible and accessible to your audience across all relevant sections."
          hideSecondaryButton
          primaryButtonText="View Details"
          onPrimaryClick={() => router.push("/dashboard/marketing/articles")}
          onClose={() => setShowPublishModal(false)}
        />
      )}

      {showToast && (
        <DashboardStatusBanner
          show={showToast}
          onClose={() => setShowToast(false)}
          message="The new category has been created and is now available for article organization."
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

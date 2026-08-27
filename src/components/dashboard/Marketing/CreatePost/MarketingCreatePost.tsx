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
import { marketingCreatePostSchema, type MarketingCreatePostValues } from "./MarketingCreatePostSchema";
import SEOSettingsSection from "@/components/dashboard/shared/SEOSettingsSection/SEOSettingsSection";
import styles from "./MarketingCreatePost.module.scss";
import type { ContentType } from "../types";
import { 
  getAdminMarketingCategories,
  getAdminArticleById,
  getAdminBlogById,
  createAdminArticle,
  createAdminBlog,
  updateAdminArticle,
  updateAdminBlog
} from "@/services/admin/adminMarketingService";

interface MarketingCreatePostProps {
  contentType: ContentType;
  postId?: string;
  onDirtyChange?: (isDirty: boolean) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function MarketingCreatePost({ contentType, postId, onDirtyChange }: MarketingCreatePostProps) {
  const [thumbnailLang, setThumbnailLang] = useState<Language>("English");
  const [imageLang, setImageLang] = useState<Language>("English");
  const [contentLang, setContentLang] = useState<Language>("English");
  const [detailsLang, setDetailsLang] = useState<Language>("English");
  const [seoLang, setSeoLang] = useState<Language>("English");
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const langMap: Record<Language, "en" | "it" | "es"> = {
    English: "en",
    Italian: "it",
    Spanish: "es",
  };

  useEffect(() => {
    getAdminMarketingCategories()
      .then((data: any) => {
        const items = Array.isArray(data) ? data : (data?.results ?? []);
        setCategories(items.map((c: any) => ({ label: c.name, value: String(c.id) })));
      })
      .catch(() => {});
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromList = searchParams?.get("from") === "list";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<MarketingCreatePostValues>({
    resolver: zodResolver(marketingCreatePostSchema),
    defaultValues: {
      category: "",
      author: "admin",
      status: "Draft",
      autoApply: false,
      translations: {
        en: { title: "", shortDescription: "", content: "", thumbnailTitle: "", thumbnailAlt: "", imageTitle: "", imageAlt: "", metaTitle: "", metaDescription: "", metaKeywords: "", slug: "" },
        it: { title: "", shortDescription: "", content: "", thumbnailTitle: "", thumbnailAlt: "", imageTitle: "", imageAlt: "", metaTitle: "", metaDescription: "", metaKeywords: "", slug: "" },
        es: { title: "", shortDescription: "", content: "", thumbnailTitle: "", thumbnailAlt: "", imageTitle: "", imageAlt: "", metaTitle: "", metaDescription: "", metaKeywords: "", slug: "" },
      },
    },
  });

  const getFullImageUrl = (path: string | undefined | null) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty);
    }
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    async function loadPost() {
      if (postId) {
        try {
          const data = contentType === "articles" 
            ? await getAdminArticleById(postId) 
            : await getAdminBlogById(postId);
          const trans = data.translations || {};

          const buildLang = (code: "en" | "it" | "es") => ({
            title: trans[code]?.title || "",
            shortDescription: trans[code]?.short_description || "",
            content: trans[code]?.content || "",
            thumbnailTitle: trans[code]?.thumbnail_title || "",
            thumbnailAlt: trans[code]?.thumbnail_alt || "",
            imageTitle: trans[code]?.image_title || "",
            imageAlt: trans[code]?.image_alt || "",
            metaTitle: trans[code]?.meta_title || "",
            metaDescription: trans[code]?.meta_description || "",
            metaKeywords: Array.isArray(trans[code]?.meta_keywords) 
              ? (trans[code]?.meta_keywords as string[]).join(', ') 
              : (trans[code]?.meta_keywords || ""),
            slug: trans[code]?.slug || "",
          });

          reset({
            category: String(data.category_id ?? data.category?.id ?? ""),
            author: "admin",
            status: data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : "Draft",
            thumbnailFile: getFullImageUrl(data.hero_image),
            imageFile: getFullImageUrl(data.featured_image),
            autoApply: false,
            scheduledDate: data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : "",
            translations: {
              en: buildLang("en"),
              it: buildLang("it"),
              es: buildLang("es"),
            },
          });
        } catch (error) {
          console.error(`Failed to load ${contentType}:`, error);
        }
      }
    }
    loadPost();
  }, [postId, reset, contentType]);

  const onSubmit = async (data: MarketingCreatePostValues, e?: React.BaseSyntheticEvent) => {
    try {
      const submitter = (e?.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement | undefined;
      const btnText = (submitter?.innerText || submitter?.textContent || "").toLowerCase();
      
      let computedStatus = "published";
      if (btnText.includes("draft") || btnText.includes("save draft") || btnText.includes("save as draft")) {
        computedStatus = "draft";
      } else if (data.scheduledDate) {
        computedStatus = "scheduled";
      }

      let hero_image: string | null | undefined = undefined;
      if (data.thumbnailFile instanceof File) {
        hero_image = await fileToBase64(data.thumbnailFile);
      } else if (typeof data.thumbnailFile === "string" && data.thumbnailFile.startsWith("data:")) {
        hero_image = data.thumbnailFile;
      } else if (!data.thumbnailFile) {
        hero_image = null;
      }

      let featured_image: string | null | undefined = undefined;
      if (data.imageFile instanceof File) {
        featured_image = await fileToBase64(data.imageFile);
      } else if (typeof data.imageFile === "string" && data.imageFile.startsWith("data:")) {
        featured_image = data.imageFile;
      } else if (!data.imageFile) {
        featured_image = null;
      }

      let formattedScheduledAt: string | null = null;
      if (data.scheduledDate) {
        const d = new Date(data.scheduledDate);
        if (!Number.isNaN(d.getTime())) {
          formattedScheduledAt = d.toISOString();
        }
      }

      const extractLang = (code: "en" | "it" | "es") => {
        const t = data.translations?.[code] || {};
        return {
          title: t.title || "",
          short_description: t.shortDescription || "",
          content: t.content || "",
          meta_title: t.metaTitle || "",
          meta_description: t.metaDescription || "",
          meta_keywords: t.metaKeywords ? t.metaKeywords.split(",").map((k: string) => k.trim()).filter(Boolean) : [],
          slug: t.slug || "",
          thumbnail_title: t.thumbnailTitle || "",
          thumbnail_alt: t.thumbnailAlt || "",
          image_title: t.imageTitle || "",
          image_alt: t.imageAlt || "",
        };
      };

      const payload: Record<string, any> = {
        translations: {
          en: extractLang("en"),
          it: extractLang("it"),
          es: extractLang("es"),
        },
        status: computedStatus,
        scheduled_at: formattedScheduledAt,
      };

      if (hero_image !== undefined) payload.hero_image = hero_image;
      if (featured_image !== undefined) payload.featured_image = featured_image;

      const categoryIdNum = Number(data.category);
      if (!Number.isNaN(categoryIdNum) && categoryIdNum > 0) {
        payload.category_id = categoryIdNum;
      }

      if (postId) {
        if (contentType === "articles") {
          await updateAdminArticle(postId, payload);
        } else {
          await updateAdminBlog(postId, payload);
        }
        
        if (fromList) {
          router.push(`/dashboard/marketing/${contentType}?editSaved=true`);
        } else {
          router.push(`/dashboard/marketing/${contentType}/${postId}?editSaved=true`);
        }
      } else {
        if (contentType === "articles") {
          await createAdminArticle(payload);
        } else {
          await createAdminBlog(payload);
        }
        
        if (computedStatus === "draft") {
          router.push(`/dashboard/marketing/${contentType}?draftSaved=true`);
        } else {
          setShowPublishModal(true);
        }
      }
    } catch (error: any) {
      console.error(`Failed to save ${contentType}:`, error);
      if (error.response?.data) {
        console.error('Backend validation error:', error.response.data);
      }
    }
  };

  const itemName = contentType === "articles" ? "Article" : "Blog Post";

  const onError = (formErrors: any) => {
    if (formErrors.translations) {
      const getLang = () => {
        if (formErrors.translations.en) return "English";
        if (formErrors.translations.it) return "Italian";
        if (formErrors.translations.es) return "Spanish";
        return null;
      };
      const langToSet = getLang();
      if (langToSet) {
        setThumbnailLang(langToSet);
        setImageLang(langToSet);
        setContentLang(langToSet);
        setDetailsLang(langToSet);
        setSeoLang(langToSet);
      }
    }
  };

  return (
    <form id="create-post-form" className={styles.page} onSubmit={handleSubmit(onSubmit, onError)}>
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
              <DashboardField key={`thumbnailTitle-${thumbnailLang}`} label="Thumbnail Title" placeholder="Thumbnail Title..." {...register(`translations.${langMap[thumbnailLang]}.thumbnailTitle`)} error={errors.translations?.[langMap[thumbnailLang]]?.thumbnailTitle?.message} />
              <DashboardField key={`thumbnailAlt-${thumbnailLang}`} label="Thumbnail Alt" placeholder="Comma-separated tags (e.g. egypt, travel, cairo)" {...register(`translations.${langMap[thumbnailLang]}.thumbnailAlt`)} error={errors.translations?.[langMap[thumbnailLang]]?.thumbnailAlt?.message} />
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
              <DashboardField key={`imageTitle-${imageLang}`} label="Image Title" placeholder="Image Title..." {...register(`translations.${langMap[imageLang]}.imageTitle`)} error={errors.translations?.[langMap[imageLang]]?.imageTitle?.message} />
              <DashboardField key={`imageAlt-${imageLang}`} label="Image Alt" placeholder="Comma-separated tags (e.g. egypt, travel, cairo)" {...register(`translations.${langMap[imageLang]}.imageAlt`)} error={errors.translations?.[langMap[imageLang]]?.imageAlt?.message} />
            </div>
          </FormSpec>
        </FormSection>

        <FormSection title={`${itemName} Content`} iconSrc="/images/dashboard/fields/article-content.svg">
          <FormSpec>
            <LanguageTabs active={contentLang} onChange={setContentLang} className={styles.whiteTabs} />
            <DashboardField key={`title-${contentLang}`} label="Title" placeholder="e.g. Summer Special 20% Off ..." {...register(`translations.${langMap[contentLang]}.title`)} error={errors.translations?.[langMap[contentLang]]?.title?.message} />
            <DashboardField
              key={`shortDesc-${contentLang}`}
              control="textarea"
              label="Short Description"
              placeholder="Brief summary shown in listings (max 300 chars)..."
              maxLength={300}
              {...register(`translations.${langMap[contentLang]}.shortDescription`)}
              error={errors.translations?.[langMap[contentLang]]?.shortDescription?.message}
            />
            <div className={styles.editorWrapper}>
              <Controller
                name={`translations.${langMap[contentLang]}.content`}
                control={control}
                render={({ field }) => (
                  <RichTextField 
                    label="Content" 
                    value={field.value ?? ""} 
                    onChange={field.onChange} 
                    error={errors.translations?.[langMap[contentLang]]?.content?.message} 
                  />
                )}
              />
            </div>
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

        <SEOSettingsSection
          title="SEO Settings"
          seoLang={seoLang}
          setSeoLang={setSeoLang}
          register={register}
          control={control}
          errors={errors}
          pathPrefix="translations"
        />

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
                    { label: "Admin User", value: "admin" },
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
          onPrimaryClick={() => router.push(`/dashboard/marketing/${contentType}`)}
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

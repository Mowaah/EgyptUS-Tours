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
import { LocalizedImageUploadSection } from "@/components/dashboard/shared";
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
  updateAdminBlog,
  createAdminMarketingCategory
} from "@/services/admin/adminMarketingService";
import { getAdminUsers } from "@/services/admin/adminUsersService";

import { fileToBase64 } from "@/utils/imageUtils";

interface MarketingCreatePostProps {
  contentType: ContentType;
  postId?: string;
  onDirtyChange?: (isDirty: boolean) => void;
  onStatusChange?: (status: string) => void;
}

export function MarketingCreatePost({ contentType, postId, onDirtyChange, onStatusChange }: MarketingCreatePostProps) {
  const [thumbnailLang, setThumbnailLang] = useState<Language>("English");
  const [imageLang, setImageLang] = useState<Language>("English");
  const [contentLang, setContentLang] = useState<Language>("English");
  const [detailsLang, setDetailsLang] = useState<Language>("English");
  const [seoLang, setSeoLang] = useState<Language>("English");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [authors, setAuthors] = useState<{ label: string; value: string }[]>([]);
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
      .catch(() => { });

    getAdminUsers()
      .then((data: any) => {
        const items = Array.isArray(data) ? data : (data?.results ?? []);
        // Map authors using their staff_profile_id since the Blog author field is a ForeignKey to StaffProfile
        setAuthors(
          items
            .filter((u: any) => u.staff_profile_id != null)
            .map((u: any) => {
              return { label: u.full_name || u.email || String(u.id), value: String(u.staff_profile_id) };
            })
        );
      })
      .catch(() => { });
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromList = searchParams?.get("from") === "list";

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<MarketingCreatePostValues>({
    resolver: zodResolver(marketingCreatePostSchema),
    defaultValues: {
      category: "",
      author: "",
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
      onDirtyChange(Object.keys(dirtyFields).length > 0);
    }
  }, [dirtyFields, onDirtyChange]);

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

          const normalizedStatus = data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : "Draft";
          
          if (onStatusChange) {
            onStatusChange(normalizedStatus);
          }

          reset({
            category: String(data.category_id ?? data.category?.id ?? ""),
            author: String(data.author_id ?? data.author?.id ?? data.author ?? ""),
            status: normalizedStatus,
            thumbnailFile: getFullImageUrl(data.hero_image),
            imageFile: getFullImageUrl(data.featured_image),
            autoApply: normalizedStatus.toLowerCase() === "published",
            scheduledDate: data.scheduled_at
              ? new Date(data.scheduled_at).toISOString().split('T')[0]
              : (normalizedStatus.toLowerCase() === "published"
                ? new Date().toISOString().split('T')[0]
                : (data.status?.toLowerCase() === "scheduled" && data.published_at
                  ? new Date(data.published_at).toISOString().split('T')[0]
                  : "")),
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

      let computedStatus = data.status ? data.status.toLowerCase() : "published";
      const btnTextLower = btnText.toLowerCase();
      if (btnTextLower.includes("draft") || btnTextLower.includes("save draft") || btnTextLower.includes("save as draft")) {
        computedStatus = "draft";
      } else if (data.autoApply) {
        computedStatus = "published";
        formattedScheduledAt = null;
      } else if (btnTextLower === "publish now" || btnTextLower === "publish post") {
        computedStatus = "published";
        formattedScheduledAt = null;
      } else if (data.scheduledDate && computedStatus !== "draft") {
        computedStatus = "scheduled";
      }

      const extractLang = (code: "en" | "it" | "es") => {
        const t = data.translations?.[code] || {};
        return {
          title: t.title || (computedStatus === "draft" ? "Untitled Draft" : ""),
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

      if (data.category) {
        const categoryIdNum = Number(data.category);
        payload.category_id = !Number.isNaN(categoryIdNum) ? categoryIdNum : data.category;
      }

      if (data.author) {
        const authorIdNum = Number(data.author);
        payload.author_id = !Number.isNaN(authorIdNum) ? authorIdNum : data.author;
      }

      if (postId) {
        if (contentType === "articles") {
          await updateAdminArticle(postId, payload);
        } else {
          await updateAdminBlog(postId, payload);
        }

        router.refresh();
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement | undefined;
    const btnTextLower = (submitter?.innerText || submitter?.textContent || "").toLowerCase();

    const isSavingDraft = btnTextLower.includes("draft") || btnTextLower.includes("save draft") || btnTextLower.includes("save as draft");
    const isEditingDraft = btnTextLower.includes("save edits") && getValues("status")?.toLowerCase() === "draft";

    if (isSavingDraft || isEditingDraft) {
      const currentValues = getValues();
      await onSubmit(currentValues, e as any);
    } else {
      await handleSubmit(onSubmit, onError)(e);
    }
  };

  return (
    <form id="create-post-form" className={styles.page} onSubmit={handleFormSubmit}>
      <div className={styles.mainColumn}>
        <LocalizedImageUploadSection
          title="Upload Thumbnail"
          iconSrc="/images/dashboard/fields/document-upload.svg"
          fileFieldName="thumbnailFile"
          titleFieldNameBase="thumbnailTitle"
          altFieldNameBase="thumbnailAlt"
          titleLabel="Thumbnail Title"
          altLabel="Thumbnail Alt"
          titlePlaceholder="Thumbnail Title..."
          altPlaceholder="Comma-separated tags (e.g. egypt, travel, cairo)"
          lang={thumbnailLang}
          setLang={setThumbnailLang}
          control={control}
          register={register}
          errors={errors}
        />

        <LocalizedImageUploadSection
          title="Upload Image"
          iconSrc="/images/dashboard/fields/document-upload.svg"
          fileFieldName="imageFile"
          titleFieldNameBase="imageTitle"
          altFieldNameBase="imageAlt"
          titleLabel="Image Title"
          altLabel="Image Alt"
          titlePlaceholder="Image Title..."
          altPlaceholder="Comma-separated tags (e.g. egypt, travel, cairo)"
          lang={imageLang}
          setLang={setImageLang}
          control={control}
          register={register}
          errors={errors}
        />

        <FormSection title={`${itemName} Content`} iconSrc="/images/dashboard/fields/blog-content.svg">
          <FormSpec>
            <LanguageTabs active={contentLang} onChange={setContentLang} variant="white" />
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
                    onChange={(checked) => {
                      onChange(checked);
                      if (checked) {
                        setValue("scheduledDate", new Date().toISOString().split('T')[0], { shouldDirty: true });
                      }
                    }}
                    ref={ref}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Details" iconSrc="/images/dashboard/fields/details.svg">
          <FormSpec>
            <LanguageTabs active={detailsLang} onChange={setDetailsLang} variant="white" />
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
                    ...authors
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
        onCreate={async (newCat) => {
          try {
            const response = await createAdminMarketingCategory({ name: newCat });
            const newCategory = { label: response.name || newCat, value: String(response.id) };
            setCategories((prev) => [...prev, newCategory]);
            
            // Automatically select the new category
            const currentValues = getValues();
            reset({ ...currentValues, category: String(response.id) });
            
            setShowToast(true);
          } catch (error) {
            console.error("Failed to create category", error);
            // Fallback for UI if backend creation fails or isn't supported yet
            const fallbackVal = newCat.toLowerCase().replace(/\s+/g, '-');
            setCategories((prev) => [...prev, { label: newCat, value: fallbackVal }]);
            const currentValues = getValues();
            reset({ ...currentValues, category: fallbackVal });
            setShowToast(true);
          }
        }}
        onDelete={(catValue) => {
          setCategories((prev) => prev.filter((c) => c.value !== catValue));
        }}
      />
    </form>
  );
}

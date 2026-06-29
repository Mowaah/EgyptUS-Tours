import React, { useState, useEffect } from "react";
import Image from "next/image";
import NationalitySelect from "@/components/shared/NationalitySelect/NationalitySelect";
import { ModalHeader, ModalFooter, DashboardField } from "@/components/dashboard/shared";;
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import StarRating from "@/components/shared/StarRating/StarRating";
import { ToggleField } from "@/components/dashboard/FormFields/ToggleField";
import dashboardStyles from "@/components/dashboard/shared/DashboardField/DashboardField.module.scss";
import styles from "./AddTestimonialModal.module.scss";

interface InitialData {
  customer?: string;
  country?: string;
  category?: string;
  rating?: number | string;
  title?: string;
  description?: string;
  videoUrl?: string;
}

export interface TestimonialFormData {
  customer: string;
  country: string;
  category: string;
  rating: string;
  title: string;
  description: string;
  videoUrl: string;
  featured?: boolean;
}

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  onSubmit?: (data: TestimonialFormData) => void;
  initialData?: InitialData;
}

export default function AddTestimonialModal({ isOpen, onClose, isEdit = false, onSubmit, initialData }: AddTestimonialModalProps) {
  const [rating, setRating] = useState("5");
  const [activeTab, setActiveTab] = useState<"basic" | "media">("basic");
  const [country, setCountry] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [category, setCategory] = useState("");
  const [testimonialTitle, setTestimonialTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isOpen) {
      if (isEdit && initialData) {
        setCustomerName(initialData.customer || "");
        setCountry(initialData.country || "");
        setCategory(initialData.category || "");
        setRating(initialData.rating ? String(initialData.rating) : "5");
        setTestimonialTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setVideoUrl(initialData.videoUrl ? String(initialData.videoUrl) : "");
      } else if (!isEdit) {
        setCustomerName("");
        setCategory("");
        setTestimonialTitle("");
        setDescription("");
        setVideoUrl("");
        setCountry("");
        setRating("5");
      }
      setErrors({});
      setActiveTab("basic");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <ModalHeader
          iconSrc="/images/dashboard/reviews/modal/review.svg"
          title={isEdit ? "Edit Testimonial" : "Add New Testimonial"}
          subtitle={isEdit ? "Update testimonial details, media, and visibility settings before publishing changes." : "Upload and publish a customer testimonial to display across the website."}
          onClose={onClose}
        />

        <div className={styles.content}>
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              type="button"
              aria-selected={activeTab === "basic"}
              className={`${styles.tab} ${activeTab === "basic" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("basic")}
            >
              Basic Information
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={activeTab === "media"}
              className={`${styles.tab} ${activeTab === "media" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("media")}
            >
              Media & Publishing
            </button>
          </div>

          {activeTab === "basic" && (
            <div className={styles.formGrid}>
              <DashboardField
                id="customer-name"
                label="Customer Name"
                placeholder="Enter customer full name"
                variant="modal"
                value={customerName}
                onChange={(e: any) => setCustomerName(e.target.value)}
                error={errors.customerName}
              />

              <div className={`${dashboardStyles.field} ${dashboardStyles.modalField}`}>
                <label className={`${dashboardStyles.label} ${dashboardStyles.modalLabel}`}>
                  Country
                </label>
                <div className={styles.countrySelectWrap} style={{ width: "100%" }}>
                  {isClient && <NationalitySelect value={country} onChange={setCountry} useCountryName={true} error={!!errors.country} />}
                </div>
                {errors.country && (
                  <div className={dashboardStyles.errorText} role="alert" style={{ marginTop: "0.25rem" }}>
                    <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                    <span>{errors.country}</span>
                  </div>
                )}
              </div>

              <DashboardField
                id="category"
                label="Category"
                control="select"
                variant="modal"
                defaultValue=""
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                error={errors.category}
                options={[
                  { label: "Select category", value: "", disabled: true },
                  { label: "Destination", value: "Destination" },
                  { label: "Adventures", value: "Adventures" },
                  { label: "Travel Tips", value: "Travel Tips" },
                ]}
              />

              <div className={`${dashboardStyles.field} ${dashboardStyles.modalField}`}>
                <label className={`${dashboardStyles.label} ${dashboardStyles.modalLabel}`}>
                  Rating
                </label>
                <div className={styles.ratingSelectWrap} style={{ width: "100%" }}>
                  {isClient && (
                    <SelectDropdown
                      id="rating"
                      value={rating}
                      onChange={setRating}
                      error={!!errors.rating}
                      checkboxStyle="checkbox"
                      options={[
                        { label: "5 Stars", value: "5", starCount: 5 },
                        { label: "4 Stars", value: "4", starCount: 4 },
                        { label: "3 Stars", value: "3", starCount: 3 },
                        { label: "2 Stars", value: "2", starCount: 2 },
                        { label: "1 Star", value: "1", starCount: 1 },
                      ]}
                      renderValue={(v) => {
                        if (!v) return <span style={{ color: "#9CA3AF" }}>Select rating</span>;
                        const starCount = parseInt(v);
                        return (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <StarRating
                              filled={starCount}
                              value={starCount}
                              formatDisplayValue={(n) => n.toFixed(1)}
                              showValue={true}
                              size={14}
                            />
                          </div>
                        );
                      }}
                      renderOption={(opt) => (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {opt.starCount ? (
                            <StarRating
                              filled={opt.starCount}
                              value={opt.starCount}
                              formatDisplayValue={(n) => n.toFixed(1)}
                              showValue={true}
                              size={14}
                            />
                          ) : (
                            <span>{opt.label}</span>
                          )}
                        </div>
                      )}
                    />
                  )}
                </div>
                {errors.rating && (
                  <div className={dashboardStyles.errorText} role="alert" style={{ marginTop: "0.25rem" }}>
                    <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                    <span>{errors.rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className={styles.singleColumnGrid}>
              <DashboardField
                id="testimonial-title"
                label="Testimonial Title"
                placeholder="Enter testimonial title"
                variant="modal"
                value={testimonialTitle}
                onChange={(e: any) => setTestimonialTitle(e.target.value)}
                error={errors.testimonialTitle}
              />
              
              <DashboardField
                id="testimonial-description"
                label="Description"
                placeholder="Enter testimonial description"
                control="textarea"
                rows={5}
                variant="modal"
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                error={errors.description}
              />
              
              <DashboardField
                id="video-url"
                label="Video URL"
                placeholder="Enter the link to your video"
                variant="modal"
                value={videoUrl}
                onChange={(e: any) => setVideoUrl(e.target.value)}
                error={errors.videoUrl}
              />
              
              <ToggleField
                label="Featured Testimonial"
                description="Highlight this testimonial in featured sections across the website."
                checked={featured}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeatured(e.target.checked)}
              />
            </div>
          )}
        </div>

        <ModalFooter
          secondaryLabel="Discard"
          secondaryOnClick={onClose}
          primaryLabel={
            activeTab === "basic" ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                Next
                <Image src="/images/arrows/arrow-right.svg" alt="" width={20} height={20} />
              </div>
            ) : isEdit ? "Save Edits" : "Publish Testimonial"
          }
          primaryOnClick={() => {
            if (activeTab === "basic") {
              const newErrors: Record<string, string> = {};
              if (!customerName.trim()) newErrors.customerName = "This field is required";
              if (!country.trim()) newErrors.country = "This field is required";
              if (!category.trim()) newErrors.category = "This field is required";
              if (!rating.trim()) newErrors.rating = "This field is required";
              
              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
              }
              setErrors({});
              setActiveTab("media");
            } else {
              const newErrors: Record<string, string> = {};
              if (!String(testimonialTitle).trim()) newErrors.testimonialTitle = "This field is required";
              if (!String(description).trim()) newErrors.description = "This field is required";
              if (!String(videoUrl).trim()) newErrors.videoUrl = "This field is required";
              
              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
              }
              setErrors({});
              onSubmit?.({
                customer: customerName,
                country,
                category,
                rating,
                title: testimonialTitle,
                description: String(description),
                videoUrl: String(videoUrl),
                featured,
              });
            }
          }}
        />
      </div>
    </div>
  );
}

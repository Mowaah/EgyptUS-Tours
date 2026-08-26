"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, PhoneInput, NationalitySelect, SuccessModal, PageHeader, Button } from "@/components/shared";
import { submitB2BProposal, extractApiError, extractFieldErrors } from "@/lib/api";
import styles from "./B2BRequestProposalPage.module.scss";

export default function B2BRequestProposalPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedId, setSubmittedId] = useState<string | number>("");
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    contactPerson: "",
    jobTitle: "",
    email: "",
    phone: "",
    website: "",
    requestDetails: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required.";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact Person is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim() || phoneDigits.length === 0) {
      newErrors.phone = "Phone Number is required.";
    } else if (phoneDigits.length < 10) {
      newErrors.phone = "The phone number entered is not valid.";
    }
    if (!formData.requestDetails.trim()) newErrors.requestDetails = "Request Details is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setIsSubmitting(true);
      const res = await submitB2BProposal(formData);
      if (res && res.id) {
        setSubmittedId(res.id);
      } else {
        setSubmittedId(Math.floor(100000 + Math.random() * 900000));
      }
      setShowModal(true);
    } catch (err: any) {
      console.error("Failed to submit B2B proposal:", err);
      const fieldErrors = extractFieldErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setErrors({ general: extractApiError(err) });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setShowModal(false);
    router.push("/");
  };

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "B2B Programs", href: "/b2b-programs" },
          { label: "Corporate Proposal", isCurrent: true },
        ]}
        title="Request a Corporate Proposal"
        subtitle="Share your requirements and we'll create a tailored proposal for your organization."
        backButton={{ text: "Back To B2B Programs", href: "/b2b-programs" }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <main className={styles.mainContent}>
        <div className={styles.content}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Company Information</h2>
              <p className={styles.formSubtitle}>Provide your company details so we can tailor the proposal accordingly</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.grid}>
                <FormField
                  id="companyName"
                  name="organization"
                  autoComplete="organization"
                  label="Company Name"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  error={errors.companyName || errors.company_name}
                />

                <FormField label="Country" error={errors.country}>
                  <NationalitySelect
                    useCountryName={true}
                    value={formData.country}
                    onChange={(val) => handleChange("country", val)}
                  />
                </FormField>

                <FormField
                  id="contactPerson"
                  name="name"
                  autoComplete="name"
                  label="Contact Person"
                  type="text"
                  placeholder="Example@Gmail.Com"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  error={errors.contactPerson || errors.contact_person}
                />

                <FormField
                  id="jobTitle"
                  name="organization-title"
                  autoComplete="organization-title"
                  label="Your Job Title"
                  type="text"
                  placeholder="Enter your position within the company"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  error={errors.jobTitle || errors.job_title}
                />

                <FormField
                  id="email"
                  name="email"
                  autoComplete="email"
                  label="Email Adress"
                  type="email"
                  placeholder="youremail@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={errors.email}
                />

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Phone Number</label>
                  <PhoneInput
                    id="b2bPhone"
                    name="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(val) => handleChange("phone", val)}
                    error={errors.phone}
                  />
                </div>

                <div className={styles.fullWidthField}>
                  <FormField
                    id="website"
                    name="url"
                    autoComplete="url"
                    label="Website"
                    type="text"
                    placeholder="www.egyptus.com"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    error={errors.website}
                  />
                </div>

                <div className={styles.textareaField}>
                  <FormField
                    id="requestDetails"
                    label="Request Details"
                    isTextarea={true}
                    placeholder="Tell us about your request."
                    value={formData.requestDetails}
                    onChange={(e: any) => handleChange("requestDetails", e.target.value)}
                    error={errors.requestDetails || errors.request_details}
                    className={styles.textarea}
                  />
                </div>
              </div>

              <hr className={styles.divider} />

              {errors.general && (
                <div className={styles.errorBanner}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {errors.general}
                </div>
              )}

              <Button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Request Corporate Proposal"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {showModal && (
        <SuccessModal
          title="Your Corporate Proposal Is in Progress"
          message="We've received your request and our team is preparing a tailored response based on your requirements."
          primaryButtonText="View Request"
          buttonText="Back to Home"
          onPrimaryClick={() => router.push("/profile?tab=requests")}
          onClose={handleReset}
          metadata={[
            { label: "Reference Number", value: `#B2B-${submittedId || "042918"}` },
            { label: "Company", value: formData.companyName || "AUS Enterprise" },
            { label: "Contact Person", value: formData.contactPerson || "John Doe" },
          ]}
        />
      )}
    </div>
  );
}

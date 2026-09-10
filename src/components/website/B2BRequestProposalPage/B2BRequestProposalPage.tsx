"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { FormField, PhoneInput, NationalitySelect, SuccessModal, PageHeader, Button } from "@/components/shared";
import { submitB2BProposal, extractApiError, extractFieldErrors, formatUrlForBackend } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./B2BRequestProposalPage.module.scss";

export default function B2BRequestProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAgentMode, setIsAgentMode] = useState(false);

  useEffect(() => {
    const hasAdminToken = Boolean(Cookies.get("admin_access_token"));
    setIsAgentMode(searchParams.get("mode") === "agent" && hasAdminToken);
  }, [searchParams]);

  const { t } = useTranslation("b2b");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedId, setSubmittedId] = useState<string | number>("");
  const submittedIdRef = useRef<string | number>("");
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
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) newErrors.companyName = t("form.errors.companyName", "Company Name is required.");
    if (!formData.country?.trim()) newErrors.country = t("form.errors.country", "Country is required.");
    if (!formData.contactPerson.trim()) newErrors.contactPerson = t("form.errors.contactPerson", "Contact Person is required.");
    if (!formData.jobTitle?.trim()) newErrors.jobTitle = t("form.errors.jobTitle", "Job Title is required.");
    if (!formData.email.trim()) {
      newErrors.email = t("form.errors.emailRequired", "Work Email Address is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t("form.errors.emailInvalid", "Please enter a valid email address.");
    }
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim() || phoneDigits.length === 0) {
      newErrors.phone = t("form.errors.phoneRequired", "Phone Number is required.");
    } else if (phoneDigits.length < 10) {
      newErrors.phone = t("form.errors.phoneInvalid", "The phone number entered is not valid.");
    }
    if (!formData.requestDetails.trim()) newErrors.requestDetails = t("form.errors.requestDetails", "Request Details is required.");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setIsSubmitting(true);
      if (isAgentMode) {
        const { createAdminB2BProposal } = await import("@/services/admin/adminRequestsService");
        const res = await createAdminB2BProposal({
          company_name: formData.companyName.trim(),
          country: formData.country.trim(),
          contact_person: formData.contactPerson.trim(),
          job_title: formData.jobTitle.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          website: formatUrlForBackend(formData.website),
          request_details: formData.requestDetails.trim(),
          start_date: null,
          end_date: null,
          currency: "usd",
          source: "agent",
        });
        const newId = res?.id ?? res?.data?.id ?? "";
        if (newId) {
          setSubmittedId(newId);
          submittedIdRef.current = newId;
        }
      } else {
        const res = await submitB2BProposal(formData);
        const newId = res?.id ?? res?.data?.id ?? "";
        if (newId) {
          setSubmittedId(newId);
          submittedIdRef.current = newId;
        }
      }
      setShowModal(true);
    } catch (err: any) {
      console.error("Failed to submit B2B proposal:", err);
      const rawErrors = extractFieldErrors(err);
      if (Object.keys(rawErrors).length > 0) {
        const fieldErrors: Record<string, string> = {};
        for (const [k, v] of Object.entries(rawErrors)) {
          const camelKey = k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          fieldErrors[camelKey] = v;
        }
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
    if (isAgentMode) {
      router.push("/dashboard/requests/b2b-programs");
    } else {
      router.push("/");
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: t("form.breadcrumbB2B", "B2B Programs"), href: "/b2b-programs" },
          { label: t("form.breadcrumbProposal", "Corporate Proposal"), isCurrent: true },
        ]}
        title={t("form.pageTitle", "Request a Corporate Proposal")}
        subtitle={t("form.pageSubtitle", "Share your requirements and we'll create a tailored proposal for your organization.")}
        backButton={{
          text: isAgentMode ? "Back to Dashboard" : t("form.backButton", "Back To B2B Programs"),
          href: isAgentMode ? "/dashboard/requests/b2b-programs" : "/b2b-programs",
        }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <main className={styles.mainContent}>
        <div className={styles.content}>
          {isAgentMode && (
            <div className={styles.agentModeBanner}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>
                <strong>Agent Mode</strong>
                <span className={styles.agentModeDesc}>: This request is being created on behalf of a client and will be registered in the dashboard with Source: Agent.</span>
              </span>
            </div>
          )}

          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>{t("form.sectionTitle", "Company Information")}</h2>
              <p className={styles.formSubtitle}>{t("form.sectionSubtitle", "Provide your company details so we can tailor the proposal accordingly")}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.grid}>
                <FormField
                  id="companyName"
                  name="organization"
                  autoComplete="organization"
                  label={t("form.companyName", "Company Name")}
                  required
                  type="text"
                  placeholder={t("form.companyNamePlaceholder", "Enter your company name")}
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  error={errors.companyName}
                />

                <FormField label={t("form.country", "Country")} required error={errors.country}>
                  <NationalitySelect
                    useCountryName={true}
                    value={formData.country}
                    onChange={(val) => handleChange("country", val)}
                    error={!!errors.country}
                  />
                </FormField>

                <FormField
                  id="contactPerson"
                  name="name"
                  autoComplete="name"
                  label={t("form.contactPerson", "Contact Person")}
                  required
                  type="text"
                  placeholder={t("form.contactPersonPlaceholder", "Full Name")}
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  error={errors.contactPerson}
                />

                <FormField
                  id="jobTitle"
                  name="organization-title"
                  autoComplete="organization-title"
                  label={t("form.jobTitle", "Job Title")}
                  required
                  type="text"
                  placeholder={t("form.jobTitlePlaceholder", "Enter your position within the company")}
                  value={formData.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  error={errors.jobTitle}
                />

                <FormField
                  id="email"
                  name="email"
                  autoComplete="email"
                  label={t("form.email", "Work Email Address")}
                  required
                  type="email"
                  placeholder={t("form.emailPlaceholder", "youremail@company.com")}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={errors.email}
                />

                <FormField
                  id="b2bPhone"
                  label={t("form.phone", "Phone Number")}
                  required
                  error={errors.phone}
                >
                  <PhoneInput
                    id="b2bPhone"
                    name="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(val) => handleChange("phone", val)}
                    hasError={!!errors.phone}
                  />
                </FormField>

                <div className={styles.fullWidthField}>
                  <FormField
                    id="website"
                    name="url"
                    autoComplete="url"
                    label={t("form.website", "Company Website (Optional)")}
                    type="text"
                    placeholder={t("form.websitePlaceholder", "www.yourcompany.com")}
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    error={errors.website}
                  />
                </div>

                <div className={styles.textareaField}>
                  <FormField
                    id="requestDetails"
                    label={t("form.requestDetails", "Tell us about your trip/event requirements...")}
                    required
                    isTextarea={true}
                    placeholder={t("form.requestDetailsPlaceholder", "Tell us about your request.")}
                    value={formData.requestDetails}
                    onChange={(e: any) => handleChange("requestDetails", e.target.value)}
                    error={errors.requestDetails}
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
                {isSubmitting ? t("form.submitting", "Submitting...") : t("form.submitButton", "Request Corporate Proposal")}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {showModal && (
        <SuccessModal
          title={
            isAgentMode
              ? "Corporate Proposal Created Successfully!"
              : t("form.successTitle", "Your Corporate Proposal Is in Progress")
          }
          message={
            isAgentMode
              ? "The proposal request has been recorded under your agent account with Source: Agent. You can now view and manage it directly in the dashboard."
              : t("form.successDesc", "We’ve received your request and our team is preparing a tailored response based on your requirements.")
          }
          primaryButtonText={
            isAgentMode
              ? "View Request in Dashboard"
              : t("form.viewRequest", "View Request")
          }
          buttonText={isAgentMode ? "Back to Dashboard" : t("form.backToHome", "Back to Home")}
          onPrimaryClick={() => {
            const targetId = submittedIdRef.current || submittedId;
            if (isAgentMode) {
              router.push(targetId ? `/dashboard/requests/b2b-programs/${targetId}` : "/dashboard/requests/b2b-programs");
            } else if (targetId) {
              router.push(`/profile/requests-details?type=b2b&id=${targetId}`);
            } else {
              router.push("/profile?tab=requests");
            }
          }}
          onClose={handleReset}
        />
      )}
    </div>
  );
}

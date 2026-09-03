"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, Button, FormField, PhoneInput, NationalitySelect, SuccessModal } from "@/components/shared";
import { submitB2BProposal, extractApiError, extractFieldErrors } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import styles from "./B2BSection.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";

export default function B2BSection() {
  const router = useRouter();
  const { t } = useTranslation("home");
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
    setFormData({
      companyName: "",
      country: "",
      contactPerson: "",
      jobTitle: "",
      email: "",
      phone: "",
      website: "",
      requestDetails: "",
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <SectionHeader
              label={t("b2bSection.label", "B2B")}
              heading={
                <>
                  {t("b2bSection.headingPart1", "Global Standards.")}
                  <br />
                  {t("b2bSection.headingPart2", "Local Expertise.")}
                </>
              }
              align="left"
              headingMaxWidth="400px"
              headingClassName={styles.largeHeading}
            />
          </div>

          <div className={styles.topRight}>
            <p className={styles.topDescription}>
              {t("b2bSection.description", "Partner with Egypt US Tours to deliver seamless travel and event experiences in Egypt. From ground handling and group travel to MICE and tailored programs, we combine local expertise with international standards to take care of every detail.")}
            </p>
            <Button
              variant="outline"
              href="/b2b-programs"
              icon={
                <Image
                  src="/images/arrows/arrow-right-blue.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              }
            >
              {t("b2bSection.partnerWithUs", "Partner With Us")}
            </Button>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.photoCollage}>
              <div className={styles.decoration}>
                <Image
                  src="/images/trips2.svg"
                  alt=""
                  width={22}
                  height={22}
                  className={styles.plane}
                />
                <Image
                  src="/images/dotted-line2.svg"
                  alt=""
                  width={293}
                  height={354}
                  className={styles.dottedLine}
                />
              </div>

              <div className={`${styles.photo} ${styles.photoTop}`}>
                <Image
                  src="/images/b2b/b2b.jpg"
                  alt="Partner destination"
                  fill
                  sizes="400px"
                  className={styles.photoImg}
                />
              </div>
              <div className={`${styles.photo} ${styles.photoMid}`}>
                <Image
                  src="/images/b2b/b2b2.jpg"
                  alt="Partner destination"
                  fill
                  sizes="400px"
                  className={styles.photoImg}
                />
              </div>
              <div className={`${styles.photo} ${styles.photoBot}`}>
                <Image
                  src="/images/b2b/b2b3.jpg"
                  alt="Partner destination"
                  fill
                  sizes="400px"
                  className={styles.photoImg}
                />
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <form className={styles.formCard} onSubmit={handleSubmit}>
              <FormField
                id="homeB2bCompany"
                name="organization"
                autoComplete="organization"
                label={t("b2bSection.companyName", "Company Name")}
                type="text"
                placeholder={t("b2bSection.companyName", "Company Name")}
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                error={errors.companyName || errors.company_name}
              />

              <FormField label={t("b2bSection.country", "Country")} error={errors.country}>
                <NationalitySelect
                  value={formData.country}
                  onChange={(val) => handleChange("country", val)}
                  useCountryName={true}
                />
              </FormField>

              <FormField
                id="homeB2bContact"
                name="name"
                autoComplete="name"
                label={t("b2bSection.contactPerson", "Contact Person")}
                type="text"
                placeholder={t("b2bSection.contactPersonPlaceholder", "Full Name")}
                value={formData.contactPerson}
                onChange={(e) => handleChange("contactPerson", e.target.value)}
                error={errors.contactPerson || errors.contact_person}
              />

              <FormField
                id="homeB2bEmail"
                name="email"
                autoComplete="email"
                label={t("b2bSection.email", "Email Address")}
                type="email"
                placeholder="youremail@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
              />

              <div className={formStyles.field}>
                <label className={formStyles.fieldLabel}>{t("b2bSection.phone", "Phone Number")}</label>
                <PhoneInput
                  id="homeB2bPhone"
                  name="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(val) => handleChange("phone", val)}
                  error={errors.phone}
                />
              </div>

              <FormField
                id="homeB2bWebsite"
                name="url"
                autoComplete="url"
                label={t("b2bSection.website", "Website")}
                type="text"
                placeholder="www.company.com"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                error={errors.website}
              />

              <FormField
                id="homeB2bDetails"
                label={t("b2bSection.requestDetails", "Request Details")}
                isTextarea
                placeholder={t("b2bSection.requestDetailsPlaceholder", "Tell us about your request.")}
                rows={4}
                value={formData.requestDetails}
                onChange={(e: any) => handleChange("requestDetails", e.target.value)}
                error={errors.requestDetails || errors.request_details}
              />

              {errors.general && (
                <div style={{ color: "var(--color-red, #dc2626)", fontSize: "0.875rem", marginBottom: "8px" }}>
                  {errors.general}
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                fullWidth
                disabled={isSubmitting}
                icon={
                  <Image
                    src="/images/arrows/arrow-right.svg"
                    alt=""
                    width={24}
                    height={24}
                    style={{ marginTop: "2px" }}
                  />
                }
              >
                {isSubmitting ? t("b2bSection.submitting", "Submitting...") : t("b2bSection.submit", "Request Proposal")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {showModal && (
        <SuccessModal
          title={t("b2bSection.successTitle", "Your Corporate Proposal Is in Progress")}
          message={t("b2bSection.successDesc", "We've received your request and our team is preparing a tailored response based on your requirements.")}
          primaryButtonText={t("b2bSection.viewRequest", "View Request")}
          buttonText={t("b2bSection.close", "Close")}
          onPrimaryClick={() => router.push("/profile?tab=requests")}
          onClose={handleReset}
          metadata={[
            { label: "Reference Number", value: `#B2B-${submittedId || "042918"}` },
            { label: t("b2bSection.companyName", "Company"), value: formData.companyName || "AUS Enterprise" },
            { label: t("b2bSection.contactPerson", "Contact Person"), value: formData.contactPerson || "John Doe" },
          ]}
        />
      )}
    </section>
  );
}

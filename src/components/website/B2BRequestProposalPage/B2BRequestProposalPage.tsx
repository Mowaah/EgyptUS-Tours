"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, PhonePrefixSelect, NationalitySelect, SuccessModal, PageHeader, Button } from "@/components/shared";
import styles from "./B2BRequestProposalPage.module.scss";

export default function B2BRequestProposalPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
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
                  label="Company Name"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                />

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Country</label>
                  <NationalitySelect
                    useCountryName={true}
                    value={formData.country}
                    onChange={(val) => handleChange("country", val)}
                  />
                </div>

                <FormField
                  id="contactPerson"
                  label="Contact Person"
                  type="text"
                  placeholder="Example@Gmail.Com"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                />

                <FormField
                  id="jobTitle"
                  label="Your Job Title"
                  type="text"
                  placeholder="Enter your position within the company"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                />

                <FormField
                  id="email"
                  label="Email Adress"
                  type="email"
                  placeholder="youremail@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Phone Number</label>
                  <div className={styles.phoneRow}>
                    <PhonePrefixSelect
                      phoneValue={formData.phone}
                      onPhoneChange={(val) => handleChange("phone", val)}
                    />
                    <input
                      type="tel"
                      className={styles.input}
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.fullWidthField}>
                  <FormField
                    id="website"
                    label="Website"
                    type="text"
                    placeholder="www.egyptustours.com"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>

                <div className={styles.textareaField}>
                  <label className={styles.fieldLabel} htmlFor="requestDetails">Request Details</label>
                  <textarea
                    id="requestDetails"
                    className={styles.textarea}
                    placeholder="Tell us about your request."
                    value={formData.requestDetails}
                    onChange={(e) => handleChange("requestDetails", e.target.value)}
                  />
                </div>
              </div>

              <hr className={styles.divider} />

              <Button type="submit" className={styles.submitBtn}>
                Request Corporate Proposal
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
          onPrimaryClick={() => setShowModal(false)}
          onClose={handleReset}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button, SuccessModal, FormField } from "@/components/shared";
import { submitContactInquiry, extractApiError } from "@/lib/api";
import { isValidEmail } from "@/utils/validators";
import Image from "next/image";
import styles from "./ContactSection.module.scss";

const AVATARS = [
  "/images/contact1.jpg",
  "/images/contact2.jpg",
  "/images/contact3.jpg",
];

export default function ContactSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.name = "Name is required.";
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!message.trim()) errs.message = "Message is required.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await submitContactInquiry({
        full_name: fullName.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setShowSuccess(true);
      setFullName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch (err: any) {
      console.error("Failed to submit contact inquiry:", err);
      setSubmitError(extractApiError(err, "Something went wrong sending your message. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.infoCard}>
            <div className={styles.headerRow}>
              <div className={styles.whatsappIcon}>
                <Image src="/images/whatsapp.svg" alt="WhatsApp" width={19.79} height={19.79} />
              </div>
              <span className={styles.label}>Contact</span>
            </div>
            <h2 className={styles.heading}>
              Not Sure Where to <br /> Start? Contact us <br /> and fill out the form
            </h2>
            <p className={styles.description}>
              Tell us what you&apos;re looking for, and our team will help you create the <br /> right Egypt experience. Fill out the form and let&apos;s start planning.
            </p>
            <div className={styles.social}>
              <div className={styles.avatars}>
                {AVATARS.map((src, i) => (
                  <div key={i} className={styles.avatar} style={{ zIndex: AVATARS.length - i }}>
                    <Image src={src} alt="Traveler" fill sizes="40px" className={styles.avatarImg} />
                  </div>
                ))}
              </div>
              <div className={styles.rating}>
                <svg width="16" height="16" viewBox="0 0 28 28" fill="none" className={styles.starIcon}>
                  <path d="M16.0182 4.09313L18.0716 8.19979C18.3516 8.77146 19.0982 9.31979 19.7282 9.42479L23.4499 10.0431C25.8299 10.4398 26.3899 12.1665 24.6749 13.8698L21.7816 16.7631C21.2916 17.2531 21.0232 18.1981 21.1749 18.8748L22.0032 22.4565C22.6566 25.2915 21.1516 26.3881 18.6432 24.9065L15.1549 22.8415C14.5249 22.4681 13.4866 22.4681 12.8449 22.8415L9.35656 24.9065C6.85989 26.3881 5.34323 25.2798 5.99656 22.4565L6.82489 18.8748C6.97656 18.1981 6.70823 17.2531 6.21823 16.7631L3.32489 13.8698C1.62156 12.1665 2.16989 10.4398 4.54989 10.0431L8.27156 9.42479C8.88989 9.31979 9.63656 8.77146 9.91656 8.19979L11.9699 4.09313C13.0899 1.86479 14.9099 1.86479 16.0182 4.09313Z" fill="#FDC700" />
                </svg>
                <span>5.0/5 Reviews</span>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            <FormField
              id="contactFullName"
              name="name"
              autoComplete="name"
              label="Full Name"
              type="text"
              placeholder="Full name here..."
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              error={errors.name}
              required
            />

            <FormField
              id="contactEmail"
              name="email"
              autoComplete="email"
              label="Email"
              type="email"
              placeholder="Your email here..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
              required
            />

            <FormField
              id="contactMessage"
              name="message"
              label="Message"
              isTextarea
              placeholder="How we can help you?"
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
              }}
              error={errors.message}
              required
            />

            {submitError && (
              <div style={{ color: "#e53e3e", marginBottom: "16px", padding: "12px", backgroundColor: "#fff5f5", borderRadius: "8px", border: "1px solid #fed7d7", fontSize: "0.9rem" }}>
                {submitError}
              </div>
            )}

            <Button
              variant="secondary"
              fullWidth
              onClick={handleSubmit}
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
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal onClose={() => setShowSuccess(false)} />
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import { Button, SuccessModal, FormField } from "@/components/shared";
import Image from "next/image";
import styles from "./ContactSection.module.scss";

const AVATARS = [
  "/images/contact1.jpg",
  "/images/contact2.jpg",
  "/images/contact3.jpg",
];

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const isEmailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.infoCard}>
            <span className={styles.label}>Contact</span>
            <h2 className={styles.heading}>
              Still not sure where to start? Contact us and fill out the form.
            </h2>
            <p className={styles.description}>
              Contact us and fill out the form, let us know what you need.
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
            <FormField label="Full Name" type="text" placeholder="Full name here..." />

            <FormField
              label="Email"
              type="email"
              placeholder="Your email here..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={isEmailInvalid ? "Please enter a valid email address." : undefined}
            />

            <FormField
              label="Message"
              isTextarea
              placeholder="How we can help you?"
              rows={5}
            />

            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                if (!isEmailInvalid) setShowSuccess(true);
              }}
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
              Send
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

"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type SVGProps } from "react";
import Image from "next/image";
import { DashboardField, DashboardStatusBanner, DashboardFooter } from "@/components/dashboard/shared";;
import styles from "./SystemConfiguration.module.scss";

interface ConfigurationValues {
  companyName: string;
  contactEmail: string;
  phone: string;
  address: string;
  smtpHost: string;
  port: string;
  username: string;
  password: string;
}

const initialValues: ConfigurationValues = {
  companyName: "",
  contactEmail: "",
  phone: "",
  address: "",
  smtpHost: "",
  port: "",
  username: "",
  password: "",
};

const initialLogo = {
  name: "",
  src: "",
};

const usernameOptions = [
  { label: "Select username", value: "", disabled: true },
  { label: "no-reply@travelco.com", value: "no-reply@travelco.com" },
  { label: "support@travelco.com", value: "support@travelco.com" },
  { label: "operations@travelco.com", value: "operations@travelco.com" },
];

const saveSuccessMessage =
  "The changes you made in the System Configuration page have been saved successfully.";

function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M10 16V4" />
      <path d="m5.5 8.5 4.5-4 4.5 4" />
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="m5.5 7.5 4.5 4 4.5-4" />
    </svg>
  );
}

function SectionHeader({
  id,
  title,
  icon,
}: {
  id: string;
  title: string;
  icon: "settings" | "mail";
}) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionIcon}>
        <span
          className={`${styles.assetIcon} ${
            icon === "settings" ? styles.settingsIcon : styles.emailIcon
          }`}
        />
      </span>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

export default function SystemConfiguration() {
  const [values, setValues] = useState<ConfigurationValues>(initialValues);
  const [logo, setLogo] = useState(initialLogo);
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (logo.src.startsWith("blob:")) {
        URL.revokeObjectURL(logo.src);
      }
    };
  }, [logo.src]);



  const updateValue = (field: keyof ConfigurationValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (hasSubmitted) setHasSubmitted(false);
  };

  const handleDiscard = () => {
    setValues(initialValues);
    setLogo((current) => {
      if (current.src.startsWith("blob:")) {
        URL.revokeObjectURL(current.src);
      }

      return initialLogo;
    });
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const nextLogoSrc = URL.createObjectURL(file);
    setLogo((current) => {
      if (current.src.startsWith("blob:")) {
        URL.revokeObjectURL(current.src);
      }

      return {
        name: file.name,
        src: nextLogoSrc,
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    
    if (
      !values.companyName.trim() ||
      !values.contactEmail.trim() ||
      !values.phone.trim() ||
      !values.address.trim() ||
      !values.smtpHost.trim() ||
      !values.port.trim() ||
      !values.username.trim() ||
      !values.password.trim()
    ) {
      return;
    }

    setShowSaveNotice(true);
    setHasSubmitted(false);
  };

  return (
    <form noValidate className={styles.wrapper} onSubmit={handleSubmit}>
      <DashboardStatusBanner
        show={showSaveNotice}
        onClose={() => setShowSaveNotice(false)}
        message={saveSuccessMessage}
      />

      <section className={styles.card} aria-labelledby="business-info-title">
        <SectionHeader id="business-info-title" title="Business Info" icon="settings" />

        <div className={styles.logoPanel}>
          <div className={styles.logoInfo}>
            <span
              className={`${styles.logoMark} ${!logo.src ? styles.logoMarkEmpty : ""}`}
              aria-hidden="true"
            >
              {logo.src ? (
                <Image
                  src={logo.src}
                  alt=""
                  width={136}
                  height={44}
                  className={styles.uploadedLogoImage}
                  unoptimized
                />
              ) : (
                <span className={styles.logoPlaceholderBadge}>
                  <UploadIcon className={styles.logoPlaceholderIcon} />
                </span>
              )}
            </span>
            <div>
              <strong>{logo.name || "No logo uploaded"}</strong>
              <span>Max size 400x400 px</span>
            </div>
          </div>

          <input
            ref={logoInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            aria-label="Upload new company logo"
            onChange={handleLogoUpload}
          />
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => logoInputRef.current?.click()}
          >
            Upload New
            <Image
              src="/images/dashboard/arrow-up.svg"
              alt=""
              width={20}
              height={20}
              className={styles.buttonIcon}
            />
          </button>
        </div>

        <div className={styles.fieldPanel}>
          <DashboardField
            id="system-company-name"
            variant="modal"
            label="Company name"
            value={values.companyName}
            onChange={(e) => updateValue("companyName", e.target.value)}
            placeholder="Enter Company name"
            className={styles.fieldInput}
            error={hasSubmitted && !values.companyName.trim() ? "This field is required" : undefined}
          />
          <DashboardField
            id="system-contact-email"
            variant="modal"
            label="Contact email"
            type="email"
            value={values.contactEmail}
            onChange={(e) => updateValue("contactEmail", e.target.value)}
            placeholder="Enter Contact email"
            className={styles.fieldInput}
            error={hasSubmitted && !values.contactEmail.trim() ? "This field is required" : undefined}
          />
          <DashboardField
            id="system-phone"
            variant="modal"
            label="Phone"
            value={values.phone}
            onChange={(e) => updateValue("phone", e.target.value)}
            placeholder="+20 123 456 7890"
            className={styles.fieldInput}
            error={hasSubmitted && !values.phone.trim() ? "This field is required" : undefined}
          />
          <DashboardField
            id="system-address"
            variant="modal"
            label="Address"
            value={values.address}
            onChange={(e) => updateValue("address", e.target.value)}
            placeholder="Type your Location..."
            className={styles.fieldInput}
            error={hasSubmitted && !values.address.trim() ? "This field is required" : undefined}
          />
        </div>
      </section>

      <section className={styles.card} aria-labelledby="email-smtp-title">
        <SectionHeader id="email-smtp-title" title="Email SMTP Settings" icon="mail" />

        <div className={styles.fieldPanel}>
          <DashboardField
            id="system-smtp-host"
            variant="modal"
            label="SMTP host"
            value={values.smtpHost}
            onChange={(e) => updateValue("smtpHost", e.target.value)}
            placeholder="smtp.travelco.com"
            className={styles.fieldInput}
            error={hasSubmitted && !values.smtpHost.trim() ? "This field is required" : undefined}
          />
          <DashboardField
            id="system-port"
            variant="modal"
            label="Port"
            inputMode="numeric"
            value={values.port}
            onChange={(e) => updateValue("port", e.target.value)}
            placeholder="465"
            className={styles.fieldInput}
            error={hasSubmitted && !values.port.trim() ? "This field is required" : undefined}
          />
          <DashboardField
            id="system-username"
            variant="modal"
            control="select"
            label="Username"
            options={usernameOptions}
            value={values.username}
            onChange={(e) => updateValue("username", e.target.value)}
            className={styles.fieldInput}
            endAdornment={<ChevronDownIcon className={styles.selectChevron} />}
            error={hasSubmitted && !values.username.trim() ? "This field is required" : undefined}
          />
          <DashboardField
            id="system-password"
            variant="modal"
            label="Password"
            type="password"
            value={values.password}
            onChange={(e) => updateValue("password", e.target.value)}
            placeholder="****************"
            className={styles.fieldInput}
            error={hasSubmitted && !values.password.trim() ? "This field is required" : undefined}
          />
        </div>
      </section>

      <DashboardFooter 
        lastUpdateDate="42/6/206" 
        isSubmit={true} 
        onDiscard={handleDiscard} 
      />
    </form>
  );
}

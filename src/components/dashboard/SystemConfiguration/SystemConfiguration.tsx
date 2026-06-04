"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type SVGProps } from "react";
import Image from "next/image";
import { DashboardField, DashboardStatusBanner } from "@/components/shared";
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
  const [saveNoticeState, setSaveNoticeState] = useState<"hidden" | "visible" | "leaving">(
    "hidden"
  );
  const [saveNoticeTick, setSaveNoticeTick] = useState(0);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (logo.src.startsWith("blob:")) {
        URL.revokeObjectURL(logo.src);
      }
    };
  }, [logo.src]);

  useEffect(() => {
    if (saveNoticeState === "hidden") return;

    const timeout = window.setTimeout(
      () => {
        setSaveNoticeState(saveNoticeState === "visible" ? "leaving" : "hidden");
      },
      saveNoticeState === "visible" ? 2800 : 260
    );

    return () => window.clearTimeout(timeout);
  }, [saveNoticeState, saveNoticeTick]);

  const updateValue = (field: keyof ConfigurationValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
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
    setSaveNoticeState("visible");
    setSaveNoticeTick((current) => current + 1);
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      {saveNoticeState !== "hidden" ? (
        <DashboardStatusBanner
          message={saveSuccessMessage}
          leaving={saveNoticeState === "leaving"}
        />
      ) : null}

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
            placeholder="Enter company name"
            className={styles.fieldInput}
            onChange={(event) => updateValue("companyName", event.target.value)}
          />
          <DashboardField
            id="system-contact-email"
            variant="modal"
            label="Contact email"
            type="email"
            value={values.contactEmail}
            placeholder="Enter contact email"
            className={styles.fieldInput}
            onChange={(event) => updateValue("contactEmail", event.target.value)}
          />
          <DashboardField
            id="system-phone"
            variant="modal"
            label="Phone"
            value={values.phone}
            placeholder="Enter phone number"
            className={styles.fieldInput}
            onChange={(event) => updateValue("phone", event.target.value)}
          />
          <DashboardField
            id="system-address"
            variant="modal"
            label="Address"
            value={values.address}
            placeholder="Enter business address"
            className={styles.fieldInput}
            onChange={(event) => updateValue("address", event.target.value)}
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
            placeholder="Enter SMTP host"
            className={styles.fieldInput}
            onChange={(event) => updateValue("smtpHost", event.target.value)}
          />
          <DashboardField
            id="system-port"
            variant="modal"
            label="Port"
            inputMode="numeric"
            value={values.port}
            placeholder="Enter port"
            className={styles.fieldInput}
            onChange={(event) => updateValue("port", event.target.value)}
          />
          <DashboardField
            id="system-username"
            variant="modal"
            control="select"
            label="Username"
            value={values.username}
            options={usernameOptions}
            className={styles.fieldInput}
            endAdornment={<ChevronDownIcon className={styles.chevronIcon} />}
            onChange={(event) => updateValue("username", event.target.value)}
          />
          <DashboardField
            id="system-password"
            variant="modal"
            label="Password"
            type="password"
            value={values.password}
            placeholder="Enter password"
            className={styles.fieldInput}
            onChange={(event) => updateValue("password", event.target.value)}
          />
        </div>
      </section>

      <footer className={styles.actionBar}>
        <p>
          Last Update: <strong>42/6/206</strong>
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.discardButton} onClick={handleDiscard}>
            Discard
          </button>
          <button type="submit" className={styles.saveButton}>
            Save Changes
            <Image
              src="/images/dashboard/save.svg"
              alt=""
              width={22}
              height={22}
              className={styles.buttonIcon}
            />
          </button>
        </div>
      </footer>
    </form>
  );
}

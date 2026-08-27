"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type SVGProps } from "react";
import Image from "next/image";
import { mutate } from "swr";
import { DashboardField, DashboardStatusBanner, DashboardFooter } from "@/components/dashboard/shared";;
import { updateSystemConfig } from "@/services/admin/adminSystemConfigService";
import type { SystemConfigResponse } from "@/services/admin/adminSystemConfigService";
import { fileToBase64 } from "@/utils/imageUtils";
import styles from "./SystemConfiguration.module.scss";

interface ConfigurationValues {
  companyName: string;
  contactEmail: string;
  phone: string;
  address: string;
}

interface SystemConfigurationProps {
  initialConfig?: SystemConfigResponse;
}

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

export default function SystemConfiguration({ initialConfig }: SystemConfigurationProps) {
  const initialValues: ConfigurationValues = {
    companyName: initialConfig?.company_name || "",
    contactEmail: initialConfig?.contact_email || "",
    phone: initialConfig?.phone || "",
    address: initialConfig?.address || "",
  };

  const initialLogo = {
    name: initialConfig?.logo ? (initialConfig.logo.split('/').pop()?.split('?')[0] || "Current Logo") : "",
    src: initialConfig?.logo || "",
    file: null as File | null,
    removed: false,
  };

  const [values, setValues] = useState<ConfigurationValues>(initialValues);
  const [logo, setLogo] = useState(initialLogo);
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  const hasUnsavedChanges =
    values.companyName !== initialValues.companyName ||
    values.contactEmail !== initialValues.contactEmail ||
    values.phone !== initialValues.phone ||
    values.address !== initialValues.address ||
    logo.file !== null ||
    logo.removed;

  // Basic email regex
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // E.164 phone format or generic 10-15 digit phone
  const isValidPhone = (phone: string) =>
    /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s-]/g, ''));

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
    if (apiErrors[field]) setApiErrors((curr) => ({ ...curr, [field]: "" }));
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
        file,
        removed: false,
      };
    });
  };

  const toBase64 = (file: File): Promise<string> => fileToBase64(file);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    
    if (
      !values.companyName.trim() ||
      !values.contactEmail.trim() ||
      !isValidEmail(values.contactEmail) ||
      !values.phone.trim() ||
      !isValidPhone(values.phone) ||
      !values.address.trim()
    ) {
      return;
    }

    setIsSaving(true);
    try {
      let logoBase64: string | null | undefined = undefined;

      if (logo.removed) {
        logoBase64 = null;
      } else if (logo.file) {
        logoBase64 = await toBase64(logo.file);
      }

      await updateSystemConfig({
        company_name: values.companyName,
        contact_email: values.contactEmail,
        phone: values.phone,
        address: values.address,
        ...(logoBase64 !== undefined && { logo: logoBase64 })
      });
      
      const updatedData = await mutate("/system-config/");
      
      if (updatedData) {
        setLogo({
          name: updatedData.logo ? (updatedData.logo.split('/').pop()?.split('?')[0] || "Current Logo") : "",
          src: updatedData.logo || "",
          file: null,
          removed: false,
        });
      }
      
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }

      setShowSaveNotice(true);
      setHasSubmitted(false);
    } catch (error: any) {
      console.error(error);
      if (error.response?.data && typeof error.response.data === 'object') {
        const errors: Record<string, string> = {};
        for (const [key, val] of Object.entries(error.response.data)) {
          if (Array.isArray(val) && val.length > 0) {
            errors[key] = val[0];
          } else if (typeof val === 'string') {
            errors[key] = val;
          }
        }
        setApiErrors(errors);
      } else {
        alert("Failed to save system configuration.");
      }
    } finally {
      setIsSaving(false);
    }
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
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
            {logo.src && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => setLogo({ name: "", src: "", file: null, removed: true })}
              >
                Remove
                <Image
                  src="/images/dashboard/delete.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.buttonIcon}
                />
              </button>
            )}
          </div>
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
            error={
              (hasSubmitted && !values.companyName.trim())
                ? "This field is required"
                : apiErrors.company_name || undefined
            }
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
            error={
              (hasSubmitted && !values.contactEmail.trim())
                ? "This field is required"
                : (hasSubmitted && !isValidEmail(values.contactEmail))
                ? "Invalid email address"
                : apiErrors.contact_email || undefined
            }
          />
          <DashboardField
            id="system-phone"
            variant="modal"
            label="Phone"
            type="tel"
            value={values.phone}
            onChange={(e) => updateValue("phone", e.target.value.replace(/[^\d\s\-\+]/g, ''))}
            placeholder="+20 123 456 7890"
            className={styles.fieldInput}
            error={
              (hasSubmitted && !values.phone.trim())
                ? "This field is required"
                : (hasSubmitted && !isValidPhone(values.phone))
                ? "Invalid phone number format"
                : apiErrors.phone || undefined
            }
          />
          <DashboardField
            id="system-address"
            variant="modal"
            label="Address"
            value={values.address}
            onChange={(e) => updateValue("address", e.target.value)}
            placeholder="Type your Location..."
            className={styles.fieldInput}
            error={
              (hasSubmitted && !values.address.trim())
                ? "This field is required"
                : apiErrors.address || undefined
            }
          />
        </div>
      </section>

      {/* 
      <section className={styles.card} aria-labelledby="email-smtp-title">
        <SectionHeader id="email-smtp-title" title="Email SMTP Settings" icon="mail" />

        <div className={styles.fieldPanel}>
          <DashboardField
            id="system-smtp-host"
            variant="modal"
            label="SMTP host"
            placeholder="smtp.travelco.com"
            className={styles.fieldInput}
          />
          <DashboardField
            id="system-port"
            variant="modal"
            label="Port"
            inputMode="numeric"
            placeholder="465"
            className={styles.fieldInput}
          />
          <DashboardField
            id="system-username"
            variant="modal"
            control="select"
            label="Username"
            options={[]}
            className={styles.fieldInput}
          />
          <DashboardField
            id="system-password"
            variant="modal"
            label="Password"
            type="password"
            placeholder="****************"
            className={styles.fieldInput}
          />
        </div>
      </section>
      */}

      <DashboardFooter 
        lastUpdateDate={initialConfig?.updated_at ? new Date(initialConfig.updated_at).toLocaleDateString() : ""} 
        isSubmit={true} 
        onDiscard={handleDiscard}
        isSaveDisabled={isSaving || !hasUnsavedChanges}
        isDiscardDisabled={isSaving || !hasUnsavedChanges}
      />
    </form>
  );
}

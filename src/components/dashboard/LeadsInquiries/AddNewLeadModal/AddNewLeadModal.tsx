"use client";

import { useState, useEffect } from "react";
import { PhonePrefixSelect } from "@/components/shared";
import { ModalHeader, ModalFooter, DashboardField } from "@/components/dashboard/shared";
import { useCreateLead, useUpdateLead } from "@/hooks/useLeads";
import { formatUrlForBackend } from "@/lib/api";
import { COUNTRIES } from "@/data/countries";
import styles from "./AddNewLeadModal.module.scss";

interface AddNewLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  initialData?: any;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  phonePrefix?: string;
  source: string;
  jobTitle: string;
  companyName: string;
  linkedin: string;
  website: string;
  notes: string;
}

export function AddNewLeadModal({ open, onClose, onSuccess, isEdit, initialData }: AddNewLeadModalProps) {
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    phonePrefix: "",
    source: "",
    jobTitle: "",
    companyName: "",
    linkedin: "",
    website: "",
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      // Reset form when modal opens or populate with initial data if editing
      const initialPhone = initialData?.phone || "";
      const match = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length).find(c => initialPhone.startsWith(c.dial));
      const phonePrefix = match ? match.dial + " " : "";
      const phoneDigits = match ? initialPhone.slice(match.dial.length).trim() : initialPhone;

      setFormData({
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: phoneDigits,
        phonePrefix: phonePrefix,
        source: (initialData?.source as unknown as string) || "",
        jobTitle: initialData?.jobTitle || "",
        companyName: initialData?.companyName || "",
        linkedin: initialData?.linkedin || "",
        website: initialData?.website || "",
        notes: initialData?.notes || ""
      });
      setErrors({});
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCreateLead = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.source) newErrors.source = "Source is required";
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";

    const formattedWebsite = formatUrlForBackend(formData.website);
    if (formattedWebsite) {
      try {
        new URL(formattedWebsite);
      } catch (e) {
        newErrors.website = "Enter a valid URL.";
      }
    }

    const formattedLinkedin = formatUrlForBackend(formData.linkedin);
    if (formattedLinkedin) {
      try {
        new URL(formattedLinkedin);
      } catch (e) {
        newErrors.linkedin = "Enter a valid URL.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      full_name: formData.name,
      email: formData.email,
      phone: `${formData.phonePrefix || "+1 "}${formData.phone}`.trim(),
      source: formData.source,
      job_title: formData.jobTitle,
      company_name: formData.companyName,
      linkedin_url: formattedLinkedin,
      website: formattedWebsite,
      note: formData.notes
    };

    const handleApiError = (err: any) => {
      if (err.response?.data) {
        const data = err.response.data;
        if (data.error_code && typeof data.error_code === "string") {
          // Custom exception format (e.g., {"error_code": "leads.phone.invalid", "message": "Phone is invalid."})
          const field = data.error_code.split(".")[1] || "general";
          setErrors({ [field]: data.message });
        } else {
          // Standard DRF ValidationError format (e.g., {"phone": ["Phone is invalid."]})
          const formattedErrors: Record<string, string> = {};
          Object.keys(data).forEach(key => {
            formattedErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
          });
          setErrors(formattedErrors);
        }
      }
    };

    if (isEdit && (initialData as any)?.id) {
      const { note, ...updatePayload } = payload;
      updateLead.mutate(
        { id: (initialData as any).id, payload: updatePayload },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
            onClose();
          },
          onError: (err: any) => {
            console.error("Failed to update lead", err);
            handleApiError(err);
          }
        }
      );
    } else {
      createLead.mutate(payload, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          onClose();
        },
        onError: (err: any) => {
          console.error("Failed to create lead", err);
          handleApiError(err);
        }
      });
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-new-lead-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ModalHeader
          onClose={onClose}
          iconSrc="/images/dashboard/inquiries/inquiries.svg" // We'll use a generic download icon for now
          title={isEdit ? "Edit Lead" : "Add New Lead"}
          id="add-new-lead-modal-title"
        />

        <div className={styles.body}>
          <div className={styles.grid}>
            <DashboardField
              id="lead-name"
              label="Name *"
              placeholder="Enter full name"
              variant="modal"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              error={errors.name}
            />
            <DashboardField
              id="lead-email"
              label="Email Address *"
              placeholder="admin@example.com"
              variant="modal"
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              error={errors.email}
            />

            <div className={styles.phoneField}>
              <label className={styles.phoneLabel}>Phone Number *</label>
              <div className={`${styles.phoneInputWrapper} ${errors.phone ? styles.phoneInputWrapperError : ""}`}>
                <PhonePrefixSelect 
                  variant="ghost" 
                  phoneValue={formData.phonePrefix}
                  onPhoneChange={(val) => handleFieldChange("phonePrefix", val)}
                />
                <input
                  type="text"
                  className={styles.phoneInput}
                  placeholder="000-0000"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                />
              </div>
              {errors.phone && (
                <span className={styles.errorText}>
                  <img src="/images/dashboard/alert-circle.svg" alt="" width={16} height={16} />
                  {errors.phone}
                </span>
              )}
            </div>

            <DashboardField
              id="lead-source"
              label="Source *"
              control="select"
              variant="modal"
              multiple={false}
              options={[
                { label: "Choose Source", value: "", disabled: true },
                { label: "Phone Call", value: "phone_call" },
                { label: "Walk-in", value: "walk_in" },
                { label: "Email", value: "email" },
                { label: "WhatsApp", value: "whatsapp" },
                { label: "Facebook", value: "facebook" },
              ]}
              value={formData.source}
              onChange={(e) => handleFieldChange("source", e.target.value)}
              error={errors.source}
            />

            <DashboardField
              id="lead-job"
              label="Job Title *"
              placeholder="Enter job title"
              variant="modal"
              value={formData.jobTitle}
              onChange={(e) => handleFieldChange("jobTitle", e.target.value)}
              error={errors.jobTitle}
            />
            <DashboardField
              id="lead-company"
              label="Company Name *"
              placeholder="Enter Company Name"
              variant="modal"
              value={formData.companyName}
              onChange={(e) => handleFieldChange("companyName", e.target.value)}
              error={errors.companyName}
            />

            <DashboardField
              id="lead-linkedin"
              label="Person Linkedin Url"
              placeholder="https://www.linkedin.com/feed/"
              variant="modal"
              value={formData.linkedin}
              onChange={(e) => handleFieldChange("linkedin", e.target.value)}
            />
            <DashboardField
              id="lead-website"
              label="Website"
              placeholder="https://devoraa.com/"
              variant="modal"
              value={formData.website}
              onChange={(e) => handleFieldChange("website", e.target.value)}
            />
          </div>

          <DashboardField
            id="lead-notes"
            label="Notes"
            control="textarea"
            placeholder="Add any additional notes or important details related to this lead here."
            variant="modal"
            value={formData.notes}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
          />
        </div>

        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel={isEdit ? "Save Changes" : "Create Lead"}
          primaryOnClick={handleCreateLead}
        />
      </section>
    </div>
  );
}

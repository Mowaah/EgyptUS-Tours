import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter, DashboardField } from "@/components/dashboard/shared";;
import dashboardStyles from "@/components/dashboard/shared/DashboardField/DashboardField.module.scss";
import styles from "./EditCustomerModal.module.scss";

interface CustomerFormData {
  fullName: string;
  phone: string;
  email: string;
  nationality: string;
  status: string;
}

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CustomerFormData) => void;
  initialData?: CustomerFormData | null;
}

export default function EditCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditCustomerModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nationality, setNationality] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFullName(initialData.fullName || "");
      setPhone(initialData.phone || "");
      setEmail(initialData.email || "");
      setNationality(initialData.nationality || "");
      setStatus(initialData.status || "");
      setErrors({});
    }
  }, [isOpen, initialData]);

  const hasChanged = Boolean(
    initialData &&
    (fullName !== (initialData.fullName || "") ||
      phone !== (initialData.phone || "") ||
      email !== (initialData.email || "") ||
      nationality !== (initialData.nationality || "") ||
      status !== (initialData.status || ""))
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "This field is required";
    if (!phone.trim()) newErrors.phone = "This field is required";
    if (!email.trim()) newErrors.email = "This field is required";
    if (!nationality.trim()) newErrors.nationality = "This field is required";
    if (!status.trim()) newErrors.status = "This field is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit?.({
      fullName,
      phone,
      email,
      nationality,
      status,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <ModalHeader
          iconSrc="/images/dashboard/sidebar/user-management.svg"
          title="Edit Customer Profile"
          onClose={onClose}
        />

        <div className={styles.content}>
          <div className={styles.formGrid}>
            <DashboardField
              id="customer-fullname"
              label="Full Name"
              placeholder=""
              variant="modal"
              value={fullName}
              onChange={(e: any) => setFullName(e.target.value)}
              error={errors.fullName}
            />

            <DashboardField
              id="customer-phone"
              label="Phone Number"
              placeholder=""
              variant="modal"
              value={phone}
              onChange={(e: any) => setPhone(e.target.value)}
              error={errors.phone}
            />

            <DashboardField
              id="customer-email"
              label="Email"
              placeholder=""
              variant="modal"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              error={errors.email}
              disabled={true}
            />

            <DashboardField
              id="customer-nationality"
              label="Nationality"
              control="select"
              variant="modal"
              defaultValue=""
              value={nationality}
              onChange={(e: any) => setNationality(e.target.value)}
              error={errors.nationality}
              options={[
                { label: "Select nationality", value: "", disabled: true },
                { label: "American", value: "American" },
                { label: "Egyptian", value: "Egyptian" },
                { label: "Japanese", value: "Japanese" },
                { label: "Spanish", value: "Spanish" },
              ]}
            />

            <DashboardField
              id="customer-status"
              label="Customer Status"
              control="select"
              variant="modal"
              defaultValue=""
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              error={errors.status}
              options={[
                { label: "Select status", value: "", disabled: true },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Blocked", value: "Blocked" },
              ]}
            />
          </div>
        </div>

        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel="Save Changes"
          primaryOnClick={handleSubmit}
          primaryDisabled={!hasChanged}
        />
      </div>
    </div>
  );
}

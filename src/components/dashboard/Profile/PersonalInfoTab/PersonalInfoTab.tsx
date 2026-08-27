"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import DeleteIcon from "@public/images/dashboard/delete.svg";
import { DashboardField, DashboardFooter, DashboardStatusBanner } from "@/components/dashboard/shared";
import styles from "./PersonalInfoTab.module.scss";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { updateAdminProfile } from "@/lib/adminCoreApi";
import { fileToBase64 } from "@/utils/imageUtils";

export function PersonalInfoTab() {
  const { adminUser, updateAdminUser } = useAdminAuth();

  const [fullName, setFullName] = useState(adminUser?.full_name || "");
  const [email, setEmail] = useState(adminUser?.email || "");
  const [phone, setPhone] = useState(adminUser?.phone || "");
  const [bio, setBio] = useState(adminUser?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(adminUser?.profile_picture || null);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adminUser) {
      setFullName(adminUser.full_name || "");
      setEmail(adminUser.email || "");
      setPhone(adminUser.phone || "");
      setBio(adminUser.bio || "");
      setAvatarPreview(adminUser.profile_picture || null);
    }
  }, [adminUser]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file, 800, 0.85);
        setAvatarPreview(base64);
      } catch (err) {
        console.error("Failed to read avatar", err);
      }
    }
  };

  const handleRemove = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!adminUser) return;
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload: any = {
        full_name: fullName,
        phone: phone || null,
        bio: bio,
      };

      if (avatarPreview === null) {
        payload.profile_picture = null;
      } else if (avatarPreview.startsWith("data:image")) {
        payload.profile_picture = avatarPreview;
      }

      const res = await updateAdminProfile(payload);

      updateAdminUser(res);
      setSuccessMessage("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail);
      } else {
        setErrorMessage("An error occurred while saving profile.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (adminUser) {
      setFullName(adminUser.full_name || "");
      setPhone(adminUser.phone || "");
      setBio(adminUser.bio || "");
      setAvatarPreview(adminUser.profile_picture || null);
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const isDirty = !!adminUser && (
    fullName !== (adminUser.full_name || "") ||
    phone !== (adminUser.phone || "") ||
    bio !== (adminUser.bio || "") ||
    avatarPreview !== (adminUser.profile_picture || null)
  );

  const formattedDate = adminUser?.updated_at
    ? new Date(adminUser.updated_at).toLocaleDateString('en-GB')
    : "Never";

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>

        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <span className={`${styles.assetIcon} ${styles.userIcon}`} />
          </span>
          <h2 id="personal-info-title">Personal Information</h2>
        </div>

        {errorMessage && (
          <DashboardStatusBanner
            message={errorMessage}
            variant="warning"
            onClose={() => setErrorMessage("")}
          />
        )}
        {successMessage && (
          <DashboardStatusBanner
            message={successMessage}
            variant="success"
            onClose={() => setSuccessMessage("")}
          />
        )}

        {/* Header Section */}
        <div className={styles.cardHeader}>
          <div className={styles.avatarSection}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder} />
            )}
            <div className={styles.avatarText}>
              <h2 className={styles.avatarTitle}>{fullName || "Name"}</h2>
              <p className={styles.avatarSubtitle}>
                {adminUser?.role_label || adminUser?.role}
                {adminUser?.department ? ` • ${adminUser.department}` : ""}
              </p>
            </div>
          </div>

          <div className={styles.avatarActions}>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className={styles.btnUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              <span>Upload New</span>
              <Image src="/images/dashboard/arrow-up.svg" alt="" width={20} height={20} />
            </button>

            <button type="button" className={styles.btnRemove} onClick={handleRemove}>
              <span>Remove</span>
              <DeleteIcon className={styles.deleteIcon} />
            </button>
          </div>
        </div>

        {/* Form Fields Area */}
        <div className={styles.formArea}>

          <DashboardField
            id="profile-fullname"
            variant="modal"
            label="Full Name"
            type="text"
            value={fullName}
            placeholder="Enter your full name"
            onChange={(e) => setFullName(e.target.value)}
          />

          <DashboardField
            id="profile-email"
            variant="modal"
            label="Email"
            type="email"
            value={email}
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />

          <DashboardField
            id="profile-phone"
            variant="modal"
            label="Phone number"
            type="tel"
            value={phone}
            placeholder="e.g. +20 100 123 4567"
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className={styles.bioRow}>
            <DashboardField
              id="profile-bio"
              variant="modal"
              control="textarea"
              label="Bio"
              value={bio}
              placeholder="Write a short bio about yourself..."
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* Footer Area */}
      <DashboardFooter
        lastUpdateDate={formattedDate}
        onSave={handleSave}
        onDiscard={handleDiscard}
        isSaveDisabled={!isDirty || isSaving}
        isDiscardDisabled={!isDirty || isSaving}
      />

    </div>
  );
}

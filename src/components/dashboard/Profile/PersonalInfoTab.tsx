"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import DeleteIcon from "@public/images/dashboard/delete.svg";
import { DashboardField, DashboardFooter } from "@/components/dashboard/shared";;
import styles from "./PersonalInfoTab.module.scss";

export function PersonalInfoTab() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleRemove = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <span className={`${styles.assetIcon} ${styles.userIcon}`} />
          </span>
          <h2 id="personal-info-title">Personal Information</h2>
        </div>

        {/* Header Section */}
        <div className={styles.cardHeader}>
          <div className={styles.avatarSection}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder} />
            )}
            <div className={styles.avatarText}>
              <h2 className={styles.avatarTitle}>Adam Saed Bakr</h2>
              <p className={styles.avatarSubtitle}>Operations Manager • Operations</p>
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
            <div className={styles.inputFieldFull}>
              <label>Bio</label>
              <textarea 
                value={bio} 
                placeholder="Write a short bio about yourself..."
                onChange={(e) => setBio(e.target.value)} 
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Footer Area */}
      <DashboardFooter lastUpdateDate="42/6/206" />

    </div>
  );
}

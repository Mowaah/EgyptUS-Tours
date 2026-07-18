import React from "react";
import Image from "next/image";
import styles from "./InfoCard.module.scss";

export interface InfoCardData {
  label: string;
  value: React.ReactNode;
  isColumn?: boolean;
}

interface InfoCardProps {
  title: string;
  iconSrc: string;
  data?: InfoCardData[];
  children?: React.ReactNode;
}

export default function InfoCard({ title, iconSrc, data = [], children }: InfoCardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <div className={styles.titleIcon}>
          <Image src={iconSrc} alt="" width={20} height={20} />
        </div>
        {title}
      </h2>
      {data.length > 0 && (
        <div className={styles.infoList}>
          {data.map((item, index) => (
            <div key={index} className={`${styles.infoRow} ${item.isColumn ? styles.infoRowColumn : ""}`}>
              <span className={styles.infoLabel}>{item.label}</span>
              <span className={styles.infoValue}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

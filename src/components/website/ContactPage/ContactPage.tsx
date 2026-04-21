import React from "react";
import Image from "next/image";
import { PageHeader } from "@/components/shared";
import ContactSection from "@/components/website/ContactSection/ContactSection";
import styles from "./ContactPage.module.scss";

export default function ContactPage() {
  const contactInfo = [
    {
      type: "Address",
      value: "Nasr City, Cairo",
      subtitle: "Egypt — 11371",
      icon: "/images/location-blue.svg",
    },
    {
      type: "Phone",
      value: "+20 152 6874 984",
      subtitle: "Sun – Thu, 9am – 6pm",
      icon: "/images/phone.svg",
    },
    {
      type: "Email",
      value: "info@egyptus.io",
      subtitle: "We reply within 24 hours",
      icon: "/images/email.svg",
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Contact Us"
        subtitle="Please read carefully to understand your rights, responsibilities, and the rules of using our services."
        subtitleMaxWidth="750px"
        decorationSrc="/images/dotted-line3.svg"
      />

      <section className={styles.contactInfoSection}>
        <div className={styles.infoGrid}>
          <div className={styles.infoLeft}>
            <div className={styles.getInTouch}>
              <Image
                src="/images/trips2.svg"
                alt=""
                width={22}
                height={20}
              />
              <span>Get In Touch</span>
            </div>

            <div className={styles.cardList}>
              {contactInfo.map((info, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.iconBackground}>
                    <Image src={info.icon} alt="" width={24} height={24} className={styles.icon} />
                  </div>
                  <div className={styles.cardTexts}>
                    <span className={styles.cardLabel}>{info.type}</span>
                    <h3 className={styles.cardValue}>{info.value}</h3>
                    <span className={styles.cardSubtitle}>{info.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mapSide}>
            <div className={styles.mapContainer}>
              {/* Using a placeholder for map but it looks real */}
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.60389656463!2d31.188423450000003!3d30.0594838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e232145781d%3A0x67396116827054f!2sNasr%20City%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1713650000000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>

              <div className={styles.mapOverlay}>
                <span className={styles.overlayText}>Nasr City, Cairo Egypt — 11371</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Nasr+City,+Cairo,+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openMapsBtn}
                >
                  <span>Open In Maps</span>
                  <Image src="/images/arrows/arrow-right.svg" alt="" width={16} height={16} className={styles.btnArrow} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}

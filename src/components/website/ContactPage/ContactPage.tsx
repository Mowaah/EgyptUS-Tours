import React from "react";
import Image from "next/image";
import { PageHeader } from "@/components/shared";
import ContactSection from "@/components/website/ContactSection/ContactSection";
import styles from "./ContactPage.module.scss";

export default function ContactPage() {
  const contactInfo = [
    {
      type: "Address",
      value: "643 Hadayk October, Giza",
      subtitle: "Egypt — 11371",
      icon: "/images/location-blue.svg",
    },
    {
      type: "Phone",
      value: "+201111400212",
      subtitle: "Sun - Thu, 9am - 6pm",
      icon: "/images/phone.svg",
    },
    {
      type: "Email",
      value: "info@egyptustours.com",
      subtitle: "We reply within 24 hours",
      icon: "/images/email.svg",
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
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
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.6087802888314!2d31.1292966!3d29.9906713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458459cf6d44e31%3A0x181b3a68212ce95c!2s643%20Hadayek%20Al%20Ahram%2C%20Kafr%20Nassar%2C%20Al%20Haram%2C%20Giza%20Governorate%203515001%2C%20Egypt!5e0!3m2!1sen!2sus!4v1777836437669!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>

              <div className={styles.mapOverlay}>
                <span className={styles.overlayText}>643 Hadayk October, Giza — Egypt</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=643+Hadayk+October,+Giza,+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openMapsBtn}
                >
                  <span>Open In Maps</span>
                  <Image src="/images/arrows/arrow-right.svg" alt="" width={16} height={16} />
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

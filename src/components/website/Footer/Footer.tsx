"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/constants";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./Footer.module.scss";

type NavLinkItem = { label: string; href?: string; value?: string };
type NavLinksType = Record<string, NavLinkItem[]>;

const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g294202-d12995117-Reviews-Egyptus_Tours-Giza_Giza_Governorate.html";

export default function Footer() {
  const { t } = useTranslation("common");

  const navLinks: NavLinksType = {
    [t("footer.egyptUs", "Egypt Us")]: [
      { label: t("nav.home", "Home"), href: "/" },
      { label: t("nav.egyptTours", "Egypt Tours"), href: "/egypttours" },
      { label: t("nav.destinations", "Destinations"), href: "/egypttours" },
      { label: t("nav.hotels", "Hotels"), href: "/hotels" },
      { label: t("nav.transportation", "Transportation"), href: "/transportation" },
      { label: t("nav.events", "Events"), href: "/events" },
      { label: t("nav.b2b", "B2B Programs"), href: "/b2b-programs" },
      { label: t("nav.aboutUs", "About Us"), href: "/about" },
      { label: t("nav.contactUs", "Contact Us"), href: "/contact" },
    ],
    [t("footer.travelGuides", "Travel Guides")]: [
      { label: t("footer.blogs", "Blogs"), href: "/blogs" },
      { label: t("footer.articles", "Articles"), href: "/articles" },
    ],
    [t("footer.customerSupport", "Customer Support")]: [
      { label: t("footer.termsConditions", "Terms & Conditions"), href: "/terms" },
      { label: t("footer.privacyPolicy", "Privacy & Policy"), href: "/privacy" },
      { label: t("footer.faqs", "FAQs"), href: "/faq" },
    ],
    [t("footer.contact", "Contact")]: CONTACT_INFO.map((item) => {
      const typeKey = item.type.toLowerCase();
      const localizedType =
        typeKey === "address"
          ? t("footer.address", "Address")
          : typeKey === "phone"
            ? t("footer.phone", "Phone")
            : typeKey === "email"
              ? t("footer.email", "Email")
              : item.type;
      return {
        label: `${localizedType}:`,
        value: item.value.trim(),
      };
    }),
  };

  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink}>
              <Image src="/images/logo-blue.svg" alt="Logo" width={150} height={30} className={styles.logo} />
            </Link>
            <p className={styles.tagline}>
              {t("footer.tagline", "Discover unforgettable travel experiences across Egypt and worldwide, designed with care, comfort, and local expertise.")}
            </p>
            <div className={styles.socialBlock}>
              <span className={styles.followLabel}>{t("footer.followUs", "Follow us")}</span>
              <div className={styles.socials}>
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={styles.socialIcon}
                    hidden={!social.visible}
                    target={social.visible ? "_blank" : undefined}
                    rel={social.visible ? "noopener noreferrer" : undefined}
                  >
                    <Image
                      src={social.iconSrc}
                      alt={social.label}
                      width={social.footerIconSize}
                      height={social.footerIconSize}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.linksGrid}>
            {Object.entries(navLinks).map(([title, links]) => {
              const isContact =
                title === t("footer.contact", "Contact") ||
                title === "Contact" ||
                title === "Contacto" ||
                title === "Contatti";
              return (
                <div
                  key={title}
                  className={`${styles.linkGroup} ${isContact ? styles.contactGroup : ""}`}
                >
                  <div className={isContact ? styles.contactContent : undefined}>
                    <h3 className={styles.linkGroupTitle}>{title}</h3>
                    <ul className={styles.linkList}>
                      {links.map((link, i) =>
                        link.href ? (
                          <li key={i}>
                            <Link href={link.href} className={styles.link}>
                              {link.label}
                            </Link>
                          </li>
                        ) : (
                          <li key={i} className={styles.contactItem}>
                            <span className={styles.contactLabel}>{link.label}</span>
                            <span className={styles.contactValue}>{link.value}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {isContact && (
                    <a
                      href={TRIPADVISOR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.tripAdvisorLink}
                      aria-label="Tripadvisor"
                    >
                      <Image
                        src="/images/tripadvisor.png"
                        alt="Tripadvisor"
                        width={153}
                        height={63}
                        className={styles.tripAdvisorImg}
                      />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.divider} />
        <p className={styles.copyright}>
          {t("footer.copyright", "© 2026 All Rights Reserved | Powered by")}{" "}
          <a
            href="https://devoraa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.poweredBy}
          >
            DevOra
          </a>
        </p>
      </div>
      <div className={styles.shapeWrapper}>
        <Image
          src="/images/footer/shape.svg"
          alt=""
          width={1050}
          height={800}
          className={styles.shape}
        />
      </div>
    </footer>
  );
}

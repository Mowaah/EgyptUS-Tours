"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTACT_INFO } from "@/constants";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./Footer.module.scss";

type NavLinkItem = { label: string; href?: string; value?: string };
type NavLinksType = Record<string, NavLinkItem[]>;

const SOCIALS = [
  {
    href: "#",
    label: "Facebook",
    icon: <Image src="/images/footer/facebook.svg" alt="Facebook" width={19} height={19} />,
  },
  {
    href: "#",
    label: "Instagram",
    icon: <Image src="/images/footer/instagram.svg" alt="Instagram" width={18} height={18} />,
  },
  {
    href: "#",
    label: "TikTok",
    icon: <Image src="/images/footer/tiktok.svg" alt="TikTok" width={18} height={18} />,
  },
  {
    href: "#",
    label: "YouTube",
    icon: <Image src="/images/footer/youtube.svg" alt="YouTube" width={18} height={18} />,
  },
  {
    href: "#",
    label: "X",
    icon: <Image src="/images/footer/x.svg" alt="X" width={18} height={18} />,
  },
  {
    href: "#",
    label: "LinkedIn",
    icon: <Image src="/images/footer/linkedin.svg" alt="LinkedIn" width={18} height={18} />,
  },
];

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
    [t("footer.contact", "Contact")]: CONTACT_INFO.map((item) => ({
      label: `${item.type}:`,
      value: item.value.trim(),
    })),
  };

  return (
    <footer className={styles.footer}>
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
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} className={styles.socialIcon}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.linksGrid}>
            {Object.entries(navLinks).map(([title, links]) => (
              <div key={title} className={styles.linkGroup}>
                <h4 className={styles.linkGroupTitle}>{title}</h4>
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
            ))}
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
          priority
        />
      </div>
    </footer>
  );
}

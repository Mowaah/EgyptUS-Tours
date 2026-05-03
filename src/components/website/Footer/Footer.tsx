import Image from "next/image";
import styles from "./Footer.module.scss";

import Link from "next/link";

type NavLinkItem = { label: string; href?: string; value?: string };
type NavLinksType = Record<string, NavLinkItem[]>;

const NAV_LINKS: NavLinksType = {
  "Egypt Us": [
    { label: "Home", href: "/" },
    { label: "Trips", href: "/trips" },
    { label: "Destinations", href: "/destinations" },
    { label: "Hotels", href: "/hotels" },
    { label: "Events", href: "/events" },
    { label: "Transportation", href: "/transportation" },
    { label: "B2B Programs", href: "/b2b-programs" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  "Travel Guides": [
    { label: "Blogs", href: "/blogs" },
    { label: "Articles", href: "/articles" },
  ],
  Contact: [
    { label: "Phone:", value: "+201111400212" },
    { label: "Email:", value: "info@egyptustours.com" },
    { label: "Address:", value: "643 Hadayk October, Giza" },
  ],
  "Customer Support": [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy & Policy", href: "/privacy" },
    { label: "FAQs", href: "/faq" },
  ],
};

const SOCIALS = [
  {
    href: "#",
    label: "LinkedIn",
    icon: <Image src="/images/linkedin.svg" alt="LinkedIn" width={18} height={18} />,
  },
  {
    href: "#",
    label: "YouTube",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0E2851" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Facebook",
    icon: <Image src="/images/facebook.svg" alt="Facebook" width={19} height={19} />,
  },
  {
    href: "#",
    label: "X",
    icon: <Image src="/images/x.svg" alt="X" width={18} height={18} />,
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink}>
              <Image src="/images/logo-blue.svg" alt="Logo" width={150} height={30} className={styles.logo} />
            </Link>
            <p className={styles.tagline}>
              Discover unforgettable travel experiences across Egypt and worldwide, designed with care, comfort, and local expertise.
            </p>
            <div className={styles.socialBlock}>
              <span className={styles.followLabel}>Follow us</span>
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
            {Object.entries(NAV_LINKS).map(([title, links]) => (
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
          © 2026 All Rights Reserved | Powered by{" "}
          <a
            href="https://devoraa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.poweredBy}
          >
            Devora
          </a>
        </p>
      </div>
    </footer>
  );
}

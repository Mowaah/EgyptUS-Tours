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
    { label: "Transportation", href: "/transportation" },
    { label: "Events", href: "/events" },
    { label: "B2B Programs", href: "/b2b-programs" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  "Travel Guides": [
    { label: "Blogs", href: "/blogs" },
    { label: "Articles", href: "/articles" },
  ],
  "Customer Support": [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy & Policy", href: "/privacy" },
    { label: "FAQs", href: "/faq" },
  ],
  Contact: [
    { label: "Phone:", value: "+201111400212" },
    { label: "Email:", value: "info@egyptustours.com" },
    { label: "Address:", value: "643 Hadayk October, Giza" },
  ],
};

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

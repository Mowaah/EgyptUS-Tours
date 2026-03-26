"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "@/components/shared/Button/Button";
import { GlassCard } from "@/components/shared";
import UserMenu from "./UserMenu";
import styles from "./Navbar.module.scss";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Trips", href: "/trips", hasDropdown: true },
  { label: "Destinations", href: "/destinations", hasDropdown: true },
  { label: "Hotels", href: "/hotels" },
  { label: "Events", href: "/events" },
  { label: "Transportation", href: "/transportation" },
  { label: "B2B Programs", href: "/b2b-programs" },
  { label: "About Us", href: "/about" },
];

const LIGHT_NAV_PATHS = ["/booking"];

const DESTINATION_LINKS = [
  { label: "Saudi Arabia", href: "/destinations/saudi-arabia" },
  { label: "Turkey", href: "/destinations/turkey" },
  { label: "Greece", href: "/destinations/greece" },
  { label: "Jordan", href: "/destinations/jordan" },
  { label: "African Safari", href: "/destinations/african-safari" },
  { label: "Peru", href: "/destinations/peru" },
  { label: "Dubai", href: "/destinations/dubai" },
  { label: "India", href: "/destinations/india" },
  { label: "Sri Lanka Tours", href: "/destinations/sri-lanka" },
  { label: "Morocco", href: "/destinations/morocco" },
  { label: "Tunisia", href: "/destinations/tunisia" },
  { label: "Oman", href: "/destinations/oman" },
];

const TRIP_LINKS = [
  { label: "Classic Tours", href: "/trips/classic" },
  { label: "Christmas Tours", href: "/trips/christmas" },
  { label: "Nile Cruises", href: "/trips/nile-cruises" },
  { label: "Classic Tours", href: "/trips/classic" },
  { label: "Christmas Tours", href: "/trips/christmas" },
  { label: "Nile Cruises", href: "/trips/nile-cruises" },
  { label: "Classic Tours", href: "/trips/classic" },
  { label: "Christmas Tours", href: "/trips/christmas" },
  { label: "Nile Cruises", href: "/trips/nile-cruises" },
  { label: "Classic Tours", href: "/trips/classic" },
  { label: "Christmas Tours", href: "/trips/christmas" },
  { label: "Nile Cruises", href: "/trips/nile-cruises" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lightNavBackground =
    LIGHT_NAV_PATHS.includes(pathname) || LIGHT_NAV_PATHS.some((p) => pathname.startsWith(`${p}/`));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const planTripButton = (
    <Button
      variant="primary"
      size="md"
      href="/booking"
      icon={
        <Image
          src="/images/arrow-right.svg"
          alt=""
          width={24}
          height={24}
          style={{ marginTop: "4px" }}
        />
      }
    >
      Plan your trip
    </Button>
  );

  return (
    <nav
      className={`${styles.navbar}${scrolled ? ` ${styles.scrolled}` : ""}${lightNavBackground ? ` ${styles.lightPage}` : ""}`}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.svg"
            alt="EgyptUS Tours"
            width={51}
            height={62}
            priority
          />
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`${styles.links} ${mobileOpen ? styles.open : ""}`}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const useDarkDropdownArrow = !isActive && (scrolled || lightNavBackground);
            const useGlass = isActive && !scrolled && !lightNavBackground && !mobileOpen;

            const content = (
              <>
                {link.label}
                {link.hasDropdown && (
                  <Image
                    src={useDarkDropdownArrow ? "/images/arrow-down2.svg" : "/images/arrow-down2-white.svg"}
                    alt=""
                    width={10}
                    height={10}
                  />
                )}
              </>
            );

            return (
              <li key={link.href} className={styles.linkItem}>
                {useGlass ? (
                  <GlassCard
                    as={Link}
                    href={link.href}
                    className={`${styles.link} ${styles.active}`}
                  >
                    {content}
                  </GlassCard>
                ) : (
                  <Link
                    href={link.href}
                    className={`${styles.link} ${isActive ? styles.active : ""} ${link.hasDropdown ? styles.hasDropdownLink : ""}`}
                  >
                    {content}
                  </Link>
                )}
                {link.hasDropdown && (
                  <div className={styles.dropdownWrapper}>
                    <div className={styles.dropdownCard}>
                      <div className={styles.dropdownGrid}>
                        {(link.label === "Destinations" ? DESTINATION_LINKS : TRIP_LINKS).map((opt, i) => (
                          <Link key={i} href={opt.href} className={styles.dropdownOption}>
                            <Image src="/images/➢.svg" alt="" width={15} height={12} className={styles.dropdownIcon} />
                            <span className={styles.dropdownText}>{opt.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className={styles.cta}>
          {lightNavBackground ? (
            <div className={styles.ctaGhost} aria-hidden="true" inert>
              {planTripButton}
            </div>
          ) : (
            planTripButton
          )}
          <UserMenu scrolled={scrolled} lightNavBackground={lightNavBackground} />
        </div>
      </div>
    </nav>
  );
}

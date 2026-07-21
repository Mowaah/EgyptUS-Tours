"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "@/components/shared/Button/Button";
import { GlassCard, AuthModal } from "@/components/shared";
import UserMenu from "./UserMenu";
import { useScrollLock } from "@/hooks/useScrollLock";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import styles from "./Navbar.module.scss";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Trips", href: "/trips", hasDropdown: true },
  { label: "Destinations", href: "/destinations", hasDropdown: true },
  { label: "Hotels", href: "/hotels" },
  { label: "Transportation", href: "/transportation" },
  { label: "Events", href: "/events" },
  { label: "B2B Programs", href: "/b2b-programs" },
  { label: "About Us", href: "/about" },
];

const LIGHT_NAV_PATHS = [
  "/booking",
  "/b2b-programs",
  "/faq",
  "/terms",
  "/privacy",
  "/proposal",
  "/contact",
  "/trips-booking",
  "/hotels-booking",
  "/transportation-booking",
  "/b2b-proposals",
  "/events-proposals"
];
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

export interface NavLinkItem {
  label: string;
  href: string;
}

const MOBILE_USER_LINKS = [
  { label: "Favorites", href: "/profile?tab=favorites", icon: "/images/heart-outline.svg" },
  { label: "Requests", href: "/profile?tab=requests", icon: "/images/archive-book.svg" },
  { label: "Bookings", href: "/profile?tab=bookings", icon: "/images/message-2.svg" },
];

const TRIP_LISTING_SLUGS = new Set(["classic", "christmas", "nile-cruises"]);

function isTripDetailPage(pathname: string): boolean {
  const match = pathname.match(/^\/trips\/([^/]+)$/);
  if (!match) return false;
  return !TRIP_LISTING_SLUGS.has(match[1]);
}

interface NavbarProps {
  tripLinks?: NavLinkItem[];
}

export default function Navbar({ tripLinks = [] }: NavbarProps) {
  const finalTripLinks = tripLinks;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const pathname = usePathname();
  const isBookingPage = pathname === "/booking";

  // Portal requires the client DOM — track mount to avoid SSR mismatch.
  useEffect(() => { setMounted(true); }, []);

  const lightNavBackground =
    LIGHT_NAV_PATHS.includes(pathname) ||
    LIGHT_NAV_PATHS.some((p) => pathname.startsWith(`${p}/`)) ||
    pathname.includes("book") ||
    pathname.includes("proposal");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (window.innerWidth >= 1150) {
        // Stop being sticky after 600px was removed per user request
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer when viewport widens to desktop; reset hideSticky when
  // narrowing so a stale transform never breaks the portal's fixed position.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1150) {
        setMobileOpen(false);
        setExpandedDropdown(null);
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setExpandedDropdown(null);
  }, [pathname]);

  useScrollLock(mobileOpen);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const planTripIcon = (
    <Image
      src="/images/arrows/arrow-right.svg"
      alt=""
      width={24}
      height={24}
      style={{ marginTop: "4px" }}
    />
  );

  const planTripButton = (
    <Button variant="primary" size="md" href="/booking" icon={planTripIcon}>
      Plan your trip
    </Button>
  );

  const planTripButtonMobile = (
    <Button variant="primary" size="md" href="/booking" icon={planTripIcon} fullWidth>
      Plan your trip
    </Button>
  );

  const shouldShowScrolled = scrolled || pathname !== "/";
  const tripDetailPage = isTripDetailPage(pathname);

  const toggleMobileDropdown = (label: string) => {
    setExpandedDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <nav
        className={`${styles.navbar}${shouldShowScrolled ? ` ${styles.scrolled}` : ""}${lightNavBackground ? ` ${styles.lightPage}` : ""}${tripDetailPage ? ` ${styles.notSticky}` : ""}${mobileOpen ? ` ${styles.drawerOpen}` : ""}`}
      >
        <div className={styles.container}>
          <Link href="/" className={styles.logo} aria-label="EgyptUS Tours — Home">
            <Image
              src={shouldShowScrolled || lightNavBackground ? "/images/logo-black.svg" : "/images/logo-white.svg"}
              alt="EgyptUS Tours"
              width={150}
              height={30}
              priority
            />
          </Link>

          {!isBookingPage && (
            <button
              className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ""}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
            >
              <span />
              <span />
              <span />
            </button>
          )}

          {/* Desktop links */}
          <ul className={styles.links}>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              const isLightBg = shouldShowScrolled || lightNavBackground;
              const useGlass = isActive && !shouldShowScrolled && !lightNavBackground;

              const content = (
                <>
                  {link.label}
                  {link.hasDropdown && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 15 8"
                      fill="none"
                      className={styles.dropdownChevron}
                      aria-hidden
                    >
                      <path
                        d="M13.95 0.75L8.51667 6.18333C7.875 6.825 6.825 6.825 6.18333 6.18333L0.75 0.75"
                        stroke="currentColor"
                        strokeOpacity={isActive && isLightBg ? 1 : undefined}
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </>
              );

              return (
                <li key={link.href} className={styles.linkItem}>
                  {useGlass ? (
                    <GlassCard
                      as={Link}
                      href={link.href}
                      variant="nav"
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
                          {(link.label === "Destinations" ? DESTINATION_LINKS : finalTripLinks).map((opt, i) => (
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
            {isBookingPage ? (
              <div className={styles.ctaGhost} aria-hidden="true" inert>
                {planTripButton}
              </div>
            ) : (
              planTripButton
            )}
            <UserMenu
              scrolled={shouldShowScrolled}
              lightNavBackground={lightNavBackground}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              openAuthModal={() => setIsAuthModalOpen(true)}
              onLogoutClick={() => setIsLogoutModalOpen(true)}
            />
          </div>
        </div>

      </nav>

      {/* Drawer + backdrop via portal — outside <nav> so no parent transform
          can affect their position:fixed anchoring. */}
      {!isBookingPage && mounted && createPortal(
        <>
          <div
            className={`${styles.backdrop} ${mobileOpen ? styles.backdropOpen : ""}`}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="mobile-drawer"
            className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ""}`}
            aria-hidden={!mobileOpen}
          >
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Menu</span>
              <button
                className={styles.drawerClose}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className={styles.drawerNav} aria-label="Mobile primary">
              <ul className={styles.drawerLinks}>
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const expanded = expandedDropdown === link.label;
                  const subLinks = link.hasDropdown
                    ? link.label === "Destinations"
                      ? DESTINATION_LINKS
                      : finalTripLinks
                    : [];

                  return (
                    <li key={link.href} className={styles.drawerLinkItem}>
                      <div className={styles.drawerLinkRow}>
                        <Link
                          href={link.href}
                          className={`${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ""}`}
                        >
                          {link.label}
                        </Link>
                        {link.hasDropdown && (
                          <button
                            type="button"
                            className={`${styles.drawerExpand} ${expanded ? styles.drawerExpandOpen : ""}`}
                            onClick={() => toggleMobileDropdown(link.label)}
                            aria-label={`${expanded ? "Collapse" : "Expand"} ${link.label}`}
                            aria-expanded={expanded}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {link.hasDropdown && expanded && (
                        <ul className={styles.drawerSubLinks}>
                          {subLinks.map((opt, i) => (
                            <li key={`${opt.href}-${i}`}>
                              <Link href={opt.href} className={styles.drawerSubLink}>
                                {opt.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className={styles.drawerDivider} />

              <ul className={styles.drawerUserLinks}>
                {isLoggedIn ? (
                  <>
                    <li className={styles.drawerGuestHeader}>
                      <div className={styles.drawerAvatarWrapper}>
                        <Image src="/images/profile-orange.svg" alt="" width={22} height={22} />
                      </div>
                      <span className={styles.drawerUsername}>Username</span>
                    </li>
                    <li className={styles.drawerDivider} />
                    {MOBILE_USER_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={styles.drawerUserLink} onClick={() => setMobileOpen(false)}>
                          <Image src={link.icon} alt="" width={22} height={22} />
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                    <li className={styles.drawerDivider} />
                    <li>
                      <button className={styles.drawerUserLink} onClick={() => { setMobileOpen(false); setIsLogoutModalOpen(true); }}>
                        <Image src="/images/logout.svg" alt="" width={22} height={22} />
                        <span>Log out</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className={styles.drawerGuestHeader}>
                      Guest
                    </li>
                    <li>
                      <Link href="/profile?tab=favorites" className={`${styles.drawerUserLink} ${styles.drawerGuestLink}`} onClick={() => setMobileOpen(false)}>
                        <Image src="/images/heart-outline.svg" alt="" width={22} height={22} />
                        <span>Favorites</span>
                      </Link>
                    </li>
                    <li className={styles.drawerDivider} />
                    <li>
                      <button className={`${styles.drawerUserLink} ${styles.drawerGuestLink}`} onClick={() => { setMobileOpen(false); setIsAuthModalOpen(true); }}>
                        <Image src="/images/profile-gray.svg" alt="" width={22} height={22} />
                        <span>Login / Sign up</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <div className={styles.drawerFooter}>{planTripButtonMobile}</div>
          </aside>
        </>,
        document.body
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      )}

      <DashboardConfirmationModal
        open={isLogoutModalOpen}
        variant="logout"
        title="Logout?"
        message="You'll need to sign in again to access your bookings, profile, and account information."
        cancelLabel="Stay Logged In"
        confirmLabel="Logout"
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          setIsLoggedIn(false);
        }}
      />
    </>
  );
}

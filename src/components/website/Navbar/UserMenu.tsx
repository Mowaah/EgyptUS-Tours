"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GlassCard, AuthModal } from "@/components/shared";
import styles from "./UserMenu.module.scss";

interface UserMenuProps {
  scrolled: boolean;
  lightNavBackground: boolean;
}

export default function UserMenu({ scrolled, lightNavBackground }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const useGlass = !scrolled && !lightNavBackground;
  const darkIcon = !useGlass;

  const toggleButton = (
    <>
      <div
        className={`${styles.profileIcon} ${darkIcon ? styles.darkIcon : ""}`}
        aria-hidden="true"
      />
      <span
        className={`${styles.hamburger} ${darkIcon ? styles.darkHamburger : ""}`}
      >
        <span />
        <span />
        <span />
      </span>
    </>
  );

  return (
    <div className={styles.wrapper} ref={menuRef}>
      {useGlass ? (
        <GlassCard as="button" className={`${styles.toggle} ${styles.glassToggle}`} onClick={() => setIsOpen(!isOpen)}>
          {toggleButton}
        </GlassCard>
      ) : (
        <button className={`${styles.toggle} ${styles.solidToggle}`} onClick={() => setIsOpen(!isOpen)}>
          {toggleButton}
        </button>
      )}

      {/* Dropdown Menu */}
      <div className={`${styles.dropdown} ${isOpen ? styles.open : ""}`}>
        {isLoggedIn ? (
          <>
            <Link
              href="/profile"
              className={`${styles.header} ${styles.headerProfileLink}`}
              onClick={() => setIsOpen(false)}
            >
              <div className={styles.avatarWrapper}>
                <Image src="/images/profile-orange.svg" alt="" width={22} height={22} className={styles.avatarIcon} />
              </div>
              <span className={styles.username}>Username</span>
            </Link>

            <div className={styles.divider} />

            <div className={styles.menuLinks}>
              <Link href="/profile?tab=favorites" className={styles.menuItem} onClick={() => setIsOpen(false)}>
                <Image src="/images/heart-outline.svg" alt="" width={24} height={24} className={styles.menuIcon} />
                <span>Favorites</span>
              </Link>
              <Link href="/profile?tab=requests" className={styles.menuItem} onClick={() => setIsOpen(false)}>
                <Image src="/images/archive-book.svg" alt="" width={24} height={24} className={styles.menuIcon} />
                <span>Requests</span>
              </Link>
              <Link href="/profile?tab=bookings" className={styles.menuItem} onClick={() => setIsOpen(false)}>
                <Image src="/images/message-2.svg" alt="" width={24} height={24} className={styles.menuIcon} />
                <span>Bookings</span>
              </Link>
            </div>

            <div className={styles.divider} />

            <button className={`${styles.menuItem} ${styles.logoutBtn}`} onClick={() => setIsLoggedIn(false)}>
              <span>Log out</span>
              <Image src="/images/logout.svg" alt="" width={24} height={24} className={styles.logoutIcon} />
            </button>
          </>
        ) : (
          <>
            <div className={styles.guestHeader}>Guest</div>

            <div className={styles.menuLinks}>
              <Link href="/profile?tab=favorites" className={styles.menuItem} onClick={() => setIsOpen(false)}>
                <Image src="/images/heart-outline.svg" alt="" width={24} height={24} className={styles.menuIcon} />
                <span>Favorites</span>
              </Link>
            </div>

            <div className={styles.divider} />

            <button className={styles.menuItem} onClick={() => { setIsOpen(false); setIsAuthModalOpen(true); }}>
              <Image src="/images/profile-gray.svg" alt="" width={24} height={24} className={styles.menuIcon} />
              <span>Login / Sign up</span>
            </button>
          </>
        )}
      </div>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onLoginSuccess={() => setIsLoggedIn(true)} 
        />
      )}
    </div>
  );
}

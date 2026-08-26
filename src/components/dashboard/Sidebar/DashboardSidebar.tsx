"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import styles from "./DashboardSidebar.module.scss";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
  defaultOpen?: boolean;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Lead Management", href: "/dashboard/leads" },
  {
    label: "Bookings",
    children: [
      { label: "Trips", href: "/dashboard/bookings/trips" },
      { label: "Transportation", href: "/dashboard/bookings/transportation" },
      { label: "Hotels", href: "/dashboard/bookings/hotels" },
    ],
  },
  {
    label: "Requests",
    children: [
      { label: "Plan Your Trip", href: "/dashboard/requests/plan-your-trip" },
      { label: "B2B Programs", href: "/dashboard/requests/b2b-programs" },
      { label: "MICE & Corporate", href: "/dashboard/requests/mice-corporate" },
      { label: "Contact Us", href: "/dashboard/requests/contact-us" },
    ],
  },
  { label: "Customers", href: "/dashboard/customers" },
  {
    label: "Catalog",
    children: [
      { label: "Trips", href: "/dashboard/catalog/trips" },
      { label: "Transportation", href: "/dashboard/catalog/transportation" },
      { label: "Hotels", href: "/dashboard/catalog/hotels" },
    ],
  },
  {
    label: "Finance",
    children: [
      { label: "Payments", href: "/dashboard/finance/payments" },
      { label: "Deposits", href: "/dashboard/finance/deposits" },
      // { label: "Financial Reports", href: "/dashboard/finance/reports" },
    ],
  },
  {
    label: "Marketing",
    children: [
      { label: "Blog", href: "/dashboard/marketing/blog" },
      { label: "Articles", href: "/dashboard/marketing/articles" },
      { label: "Promotions", href: "/dashboard/marketing/promotions" },
    ],
  },
  { label: "Reviews", href: "/dashboard/reviews" },
  { label: "Reports & Analytics", href: "/dashboard/analytics" },
  {
    label: "Settings",
    children: [
      { label: "User Management", href: "/dashboard/settings/user-management" },
      { label: "Access Control", href: "/dashboard/settings/access-control" },
      // { label: "System Configuration", href: "/dashboard/settings/system-configuration" },
      { label: "Audit Log", href: "/dashboard/settings/audit-log" },
    ],
  },
  {
    label: "Legal & Help Center",
    children: [
      { label: "FAQ Management", href: "/dashboard/settings/faq-management" },
      { label: "Terms & Conditions", href: "/dashboard/settings/terms-conditions" },
      { label: "Privacy Policy", href: "/dashboard/settings/privacy-policy" },
    ],
  },
  { label: "SEO Configuration", href: "/dashboard/seo" },
];

const toKebabCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const iconNameByLabel: Partial<Record<string, string>> = {
  "Privacy Policy": "privacy",
  "FAQ Management": "faq",
  "Lead Management": "leads-inquiries",
};

function DashboardIcon({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Image
      src={`/images/dashboard/sidebar/${iconNameByLabel[label] ?? toKebabCase(label)}.svg`}
      alt=""
      width={24}
      height={24}
      className={className}
      aria-hidden
    />
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <Image
      src="/images/dashboard/sidebar/chevron.svg"
      alt=""
      width={20}
      height={20}
      className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
      aria-hidden
      suppressHydrationWarning
    />
  );
}

function NavChildren({
  items,
  id,
  open,
  pathname,
}: {
  items: NavItem[];
  id: string;
  open: boolean;
  pathname: string;
}) {
  return (
    <div className={`${styles.subnav} ${open ? styles.subnavOpen : ""}`} id={id} suppressHydrationWarning>
      <span className={styles.branch} aria-hidden />
      <ul className={styles.subnavList}>
        {items.map((item) => {
          const href = item.href;
          const isActive = href
            ? pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
            : false;
          const linkClassName = `${styles.subnavLink} ${isActive ? styles.active : ""}`;

          return (
            <li key={item.label}>
              {href ? (
                <Link
                  href={href}
                  className={linkClassName}
                  aria-current={isActive ? "page" : undefined}
                >
                  <DashboardIcon label={item.label} className={styles.subnavIcon} />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <a
                  className={linkClassName}
                  href="#"
                  aria-current={isActive ? "page" : undefined}
                >
                  <DashboardIcon label={item.label} className={styles.subnavIcon} />
                  <span>{item.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const settingsPathPrefix = "/dashboard/settings";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openGroups, toggleGroup } = useSidebarContext();
  const { adminUser, logoutAdminTokens } = useAdminAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const savedScroll = localStorage.getItem("sidebarScrollPos");
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  return (
    <aside className={styles.sidebar} aria-label="Dashboard navigation">
      <div className={styles.inner}>
        <div className={styles.top} ref={scrollRef} onScroll={(e) => localStorage.setItem("sidebarScrollPos", (e.target as HTMLDivElement).scrollTop.toString())} id="dashboard-sidebar-scroll">
          <div className={styles.sidebarHeader}>
            <a href="/dashboard" className={styles.logoLink} aria-label="Egypt-Us dashboard home">
              <Image
                src="/images/logo-blue.svg"
                alt="Egypt-Us"
                width={189}
                height={44}
                priority
                className={styles.logo}
                style={{ width: "auto", height: "auto" }}
              />
            </a>

            <div className={styles.divider} />
          </div>

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isOpen = Boolean(openGroups[item.label]);
                const subnavId = `dashboard-sidebar-${toKebabCase(item.label)}`;
                const href = item.href;
                const isActive = href
                  ? pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
                  : false;

                return (
                  <li key={item.label} className={styles.navGroup}>
                    {hasChildren ? (
                      <button
                        type="button"
                        className={`${styles.navLink} ${styles.navButton} ${isActive ? styles.active : ""
                          }`}
                        aria-expanded={isOpen}
                        aria-controls={subnavId}
                        onClick={() => toggleGroup(item.label)}
                        suppressHydrationWarning
                      >
                        <DashboardIcon label={item.label} className={styles.navIcon} />
                        <span>{item.label}</span>
                        <Chevron open={isOpen} />
                      </button>
                    ) : href ? (
                      <Link
                        href={href}
                        className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <DashboardIcon label={item.label} className={styles.navIcon} />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <a
                        href="#"
                        className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <DashboardIcon label={item.label} className={styles.navIcon} />
                        <span>{item.label}</span>
                      </a>
                    )}

                    {item.children ? (
                      <NavChildren
                        items={item.children}
                        id={subnavId}
                        open={isOpen}
                        pathname={pathname}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <footer className={styles.profile}>
          <div className={styles.profileDivider} />
          <div className={styles.profileRow}>
            <Link href="/dashboard/profile" className={styles.profileLink}>
              {adminUser?.profile_picture ? (
                <img src={adminUser.profile_picture} alt="Avatar" className={styles.avatarImage} />
              ) : (
                <div className={styles.avatar} aria-hidden />
              )}
              <div className={styles.profileText}>
                <strong>{adminUser?.full_name || "Name"}</strong>
                <span>{adminUser?.role_label || adminUser?.role}</span>
              </div>
            </Link>
            <button
              className={styles.logoutButton}
              type="button"
              aria-label="Log out"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <DashboardIcon label="Logout" className={styles.logoutIcon} />
            </button>
          </div>
        </footer>
      </div>

      <DashboardConfirmationModal
        open={isLogoutModalOpen}
        variant="logout"
        title="Logout?"
        message="Your account will remain safe and secure"
        confirmLabel="Logout"
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          await logoutAdminTokens();
          setIsLogoutModalOpen(false);
          router.push("/dashboard/login");
        }}
      />
    </aside>
  );
}

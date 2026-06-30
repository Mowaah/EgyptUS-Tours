"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import styles from "./DashboardSidebar.module.scss";
import { useSidebarContext } from "@/contexts/SidebarContext";

interface NavItem {
  label: string;
  active?: boolean;
  defaultOpen?: boolean;
  children?: NavItem[];
}

const navRoutes: Record<string, string> = {
  Dashboard: "/dashboard",
  "Lead Management": "/dashboard/leads",
  Trips: "/dashboard/bookings/trips",
  Transportation: "/dashboard/bookings/transportation",
  Hotels: "/dashboard/bookings/hotels",
  Customers: "/dashboard/customers",
  Reviews: "/dashboard/reviews",
  "User Management": "/dashboard/settings/user-management",
  "Access Control": "/dashboard/settings/access-control",
  "System Configuration": "/dashboard/settings/system-configuration",
  "Audit Log": "/dashboard/settings/audit-log",
  "FAQ Management": "/dashboard/settings/faq-management",
  "Terms & Conditions": "/dashboard/settings/terms-conditions",
  "Privacy Policy": "/dashboard/settings/privacy-policy",
  Blog: "/dashboard/marketing/blog",
  Articles: "/dashboard/marketing/articles",
  Promotions: "/dashboard/marketing/promotions",
  Payments: "/dashboard/finance/payments",
  Deposits: "/dashboard/finance/deposits",
  "Financial Reports": "/dashboard/finance/reports",
  "Reports & Analytics": "/dashboard/analytics",
  "SEO Configuration": "/dashboard/seo",
};

const navItems: NavItem[] = [
  { label: "Dashboard" },
  { label: "Lead Management" },
  {
    label: "Bookings",
    children: [
      { label: "Trips" },
      { label: "Transportation" },
      { label: "Hotels" },
    ],
  },
  {
    label: "Requests",
    children: [
      { label: "Plan Your Trip" },
      { label: "B2B Programs" },
      { label: "MICE & Corporate" },
    ],
  },
  { label: "Customers" },
  {
    label: "Catalog",
    children: [
      { label: "Trips" },
      { label: "Transportation" },
      { label: "Hotels" },
    ],
  },
  {
    label: "Finance",
    children: [
      { label: "Payments" },
      { label: "Deposits" },
      { label: "Financial Reports" },
    ],
  },
  {
    label: "Marketing",
    children: [
      { label: "Blog" },
      { label: "Articles" },
      { label: "Promotions" },
    ],
  },
  { label: "Reviews" },
  { label: "Reports & Analytics" },
  {
    label: "Settings",
    children: [
      { label: "User Management" },
      { label: "Access Control" },
      { label: "System Configuration" },
      { label: "Audit Log" },
    ],
  },
  {
    label: "Legal & Help Center",
    children: [
      { label: "FAQ Management" },
      { label: "Terms & Conditions" },
      { label: "Privacy Policy" },
    ],
  },
  { label: "SEO Configuration" },
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
          const href = navRoutes[item.label];
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
            <a href="/dashboard" className={styles.logoLink} aria-label="Egypt US dashboard home">
              <Image
                src="/images/logo-blue.svg"
                alt="Egypt US"
                width={189}
                height={44}
                priority
                className={styles.logo}
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
                const href = navRoutes[item.label];
                const isActive = href
                  ? pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
                  : false;

                return (
                  <li key={item.label} className={styles.navGroup}>
                    {hasChildren ? (
                      <button
                        type="button"
                        className={`${styles.navLink} ${styles.navButton} ${
                          isActive ? styles.active : ""
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
              <div className={styles.avatar} aria-hidden />
              <div className={styles.profileText}>
                <strong>Adam Saed</strong>
                <span>Admin</span>
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
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          router.push("/dashboard/login");
        }}
      />
    </aside>
  );
}

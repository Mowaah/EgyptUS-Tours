"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./DashboardSidebar.module.scss";

interface NavItem {
  label: string;
  active?: boolean;
  defaultOpen?: boolean;
  children?: NavItem[];
}

const navRoutes: Record<string, string> = {
  Dashboard: "/dashboard",
  "Leads & Inquiries": "/dashboard/leads",
  "User Management": "/dashboard/settings/user-management",
  "Access Control": "/dashboard/settings/access-control",
  "System Configuration": "/dashboard/settings/system-configuration",
  "Audit Log": "/dashboard/settings/audit-log",
};

const navItems: NavItem[] = [
  { label: "Dashboard" },
  { label: "Leads & Inquiries" },
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

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <Image
      src="/images/dashboard/sidebar/chevron.svg"
      alt=""
      width={20}
      height={20}
      className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
      aria-hidden
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
    <div className={`${styles.subnav} ${open ? styles.subnavOpen : ""}`} id={id}>
      <span className={styles.branch} aria-hidden />
      <ul className={styles.subnavList}>
        {items.map((item) => {
          const href = navRoutes[item.label];
          const isActive = href ? pathname === href : false;
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

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const groups = Object.fromEntries(
      navItems
        .filter((item) => item.children?.length)
        .map((item) => [item.label, Boolean(item.defaultOpen)])
    );

    if (pathname.startsWith(settingsPathPrefix)) {
      groups.Settings = true;
    }

    return groups;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  return (
    <aside className={styles.sidebar} aria-label="Dashboard navigation">
      <div className={styles.inner}>
        <div className={styles.top}>
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
                const isActive = href ? pathname === href : false;

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
            <div className={styles.avatar} aria-hidden />
            <div className={styles.profileText}>
              <strong>Adam Saed</strong>
              <span>Admin</span>
            </div>
            <button className={styles.logoutButton} type="button" aria-label="Log out">
              <DashboardIcon label="Logout" className={styles.logoutIcon} />
            </button>
          </div>
        </footer>
      </div>
    </aside>
  );
}

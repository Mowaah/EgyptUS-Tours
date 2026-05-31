"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./DashboardSidebar.module.scss";

interface NavItem {
  label: string;
  active?: boolean;
  defaultOpen?: boolean;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", active: true },
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

function NavChildren({ items, id, open }: { items: NavItem[]; id: string; open: boolean }) {
  return (
    <div className={`${styles.subnav} ${open ? styles.subnavOpen : ""}`} id={id}>
      <span className={styles.branch} aria-hidden />
      <ul className={styles.subnavList}>
        {items.map((item) => (
          <li key={item.label}>
            <a
              className={`${styles.subnavLink} ${item.active ? styles.active : ""}`}
              href="#"
              aria-current={item.active ? "page" : undefined}
            >
              <DashboardIcon label={item.label} className={styles.subnavIcon} />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardSidebar() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      navItems
        .filter((item) => item.children?.length)
        .map((item) => [item.label, Boolean(item.defaultOpen)])
    )
  );

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

                return (
                  <li key={item.label} className={styles.navGroup}>
                    {hasChildren ? (
                      <button
                        type="button"
                        className={`${styles.navLink} ${styles.navButton} ${
                          item.active ? styles.active : ""
                        }`}
                        aria-expanded={isOpen}
                        aria-controls={subnavId}
                        onClick={() => toggleGroup(item.label)}
                      >
                        <DashboardIcon label={item.label} className={styles.navIcon} />
                        <span>{item.label}</span>
                        <Chevron open={isOpen} />
                      </button>
                    ) : (
                      <a
                        href="#"
                        className={`${styles.navLink} ${item.active ? styles.active : ""}`}
                        aria-current={item.active ? "page" : undefined}
                      >
                        <DashboardIcon label={item.label} className={styles.navIcon} />
                        <span>{item.label}</span>
                      </a>
                    )}

                    {item.children ? (
                      <NavChildren items={item.children} id={subnavId} open={isOpen} />
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

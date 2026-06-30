/**
 * Dashboard Navbar page-copy configuration.
 *
 * Add a new entry here whenever a new dashboard route is created.
 * The key is the exact Next.js pathname, e.g. "/dashboard/settings/my-page".
 */

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface PageCopy {
  title: string;
  subtitle: string;
  breadcrumbTrail: BreadcrumbSegment[];
  searchPlaceholder?: string;
  hideSearch?: boolean;
  primaryAction?: { label: string; iconSrc?: string; iconRotation?: number; form?: string; type?: "button" | "submit"; hideIcon?: boolean };
  secondaryAction?: { label: string; iconSrc?: string; iconRotation?: number; form?: string; type?: "button" | "submit"; hideIcon?: boolean };
  hideFilterButton?: boolean;
}

const pageCopyByPath: Record<string, PageCopy> = {
  "/dashboard": {
    title: "Dashboard Overview",
    subtitle: "Let's review your update for today",
    breadcrumbTrail: [],
  },
  "/dashboard/leads": {
    title: "Leads Management",
    subtitle: "Track and manage all incoming customer inquiries.",
    breadcrumbTrail: [{ label: "Leads Management" }],
    primaryAction: { label: "Add New Lead", iconSrc: "/images/dashboard/navbar/add-circle.svg" },
  },
  "/dashboard/bookings/trips": {
    title: "Trips",
    subtitle: "Monitor and control trips and accommodations",
    breadcrumbTrail: [{ label: "Bookings" }, { label: "Trips" }],
    searchPlaceholder: "Search bookings, customers...",
    primaryAction: { label: "New Booking", iconSrc: "/images/dashboard/navbar/add-circle.svg" },
  },
  "/dashboard/bookings/transportation": {
    title: "Transportation",
    subtitle: "Manage transportation bookings and transfers",
    breadcrumbTrail: [{ label: "Bookings" }, { label: "Transportation" }],
    searchPlaceholder: "Search transfers, guests...",
    primaryAction: { label: "New Booking", iconSrc: "/images/dashboard/navbar/add-circle.svg" },
  },
  "/dashboard/settings/user-management": {
    title: "User Management",
    subtitle: "Manage and organize all system users, control access levels",
    breadcrumbTrail: [{ label: "Settings" }, { label: "User Management" }],
    searchPlaceholder: "Search names, emails...",
    primaryAction: { label: "New Admin" },
  },
  "/dashboard/settings/access-control": {
    title: "Access Control",
    subtitle: "Control user permissions and manage access levels across the admin dashboard.",
    breadcrumbTrail: [{ label: "Settings" }, { label: "Access Control" }],
    searchPlaceholder: "Search bookings, customers...",
    primaryAction: { label: "New Admin Role" },
  },
  "/dashboard/settings/system-configuration": {
    title: "System Configuration",
    subtitle: "Manage and customize system settings, preferences, and platform configurations.",
    breadcrumbTrail: [{ label: "Settings" }, { label: "System Configuration" }],
    searchPlaceholder: "Search bookings, customers...",
    primaryAction: { label: "New Admin" },
  },
  "/dashboard/settings/audit-log": {
    title: "Audit Log",
    subtitle: "Track and review all system activities, user actions, and recent administrative changes.",
    breadcrumbTrail: [{ label: "Settings" }, { label: "Audit Log" }],
    searchPlaceholder: "Search bookings, customers...",
    primaryAction: { label: "New Admin" },
  },
  "/dashboard/settings/faq-management": {
    title: "FAQ Management",
    subtitle: "Easily manage common questions and answers for users",
    breadcrumbTrail: [{ label: "Legal & Help Center" }, { label: "FAQ Management" }],
    searchPlaceholder: "Search FAQs...",
    primaryAction: { label: "Add New FAQ" },
  },
  "/dashboard/settings/terms-conditions": {
    title: "Terms & Conditions",
    subtitle: "Edit and organize terms, rules, and user agreements",
    breadcrumbTrail: [{ label: "Legal & Help Center" }, { label: "Terms & Conditions" }],
    searchPlaceholder: "Search terms...",
    primaryAction: { label: "Add New Terms" },
  },
  "/dashboard/settings/privacy-policy": {
    title: "Privacy and Policy",
    subtitle: "Details about data privacy and user information handling",
    breadcrumbTrail: [{ label: "Legal & Help Center" }, { label: "Privacy and Policy" }],
    searchPlaceholder: "Search privacy policies...",
    primaryAction: { label: "Add New Privacy" },
  },
  "/dashboard/profile": {
    title: "Profile",
    subtitle: "Manage your personal information and security settings.",
    breadcrumbTrail: [{ label: "Profile" }, { label: "Personal Information" }],
  },
  "/dashboard/marketing/blog": {
    title: "Blogs",
    subtitle: "Manage blog posts and articles.",
    breadcrumbTrail: [{ label: "Marketing" }, { label: "Blog" }],
    searchPlaceholder: "Search Posts...",
    primaryAction: { label: "Create Post" },
    hideFilterButton: true,
  },
  "/dashboard/marketing/blog/create": {
    title: "Create New Post",
    subtitle: "Write and publish blog content",
    breadcrumbTrail: [{ label: "Marketing" }, { label: "Blog", href: "/dashboard/marketing/blog" }, { label: "Create Post" }],
    hideFilterButton: true,
    hideSearch: true,
    primaryAction: { label: "Publish Post", iconSrc: "/images/dashboard/arrow-up.svg", iconRotation: 90, form: "create-post-form", type: "submit" },
    secondaryAction: { label: "Save draft", iconSrc: "/images/dashboard/save2.svg" },
  },
  "/dashboard/marketing/articles": {
    title: "Articles",
    subtitle: "Manage article posts.",
    breadcrumbTrail: [{ label: "Marketing" }, { label: "Article" }],
    searchPlaceholder: "Search Posts...",
    primaryAction: { label: "Create Post" },
    hideFilterButton: true,
  },
  "/dashboard/marketing/articles/create": {
    title: "Create New Post",
    subtitle: "Write and publish article content",
    breadcrumbTrail: [{ label: "Marketing" }, { label: "Article", href: "/dashboard/marketing/articles" }, { label: "Create Post" }],
    hideFilterButton: true,
    hideSearch: true,
    primaryAction: { label: "Publish Post", iconSrc: "/images/dashboard/arrow-up.svg", iconRotation: 90, form: "create-post-form", type: "submit" },
    secondaryAction: { label: "Save draft", iconSrc: "/images/dashboard/save2.svg" },
  },
  "/dashboard/marketing/promotions": {
    title: "Promotions",
    subtitle: "Manage your offers and discounts",
    breadcrumbTrail: [{ label: "Marketing" }, { label: "Promotions" }],
    searchPlaceholder: "Search Offers...",
    primaryAction: { label: "Create Offer" },
    hideFilterButton: true,
  },
  "/dashboard/marketing/promotions/create": {
    title: "Create New Offer",
    subtitle: "Set up discounts and promotional campaigns",
    breadcrumbTrail: [{ label: "Marketing" }, { label: "Promotions", href: "/dashboard/marketing/promotions" }, { label: "Create Offer" }],
    hideSearch: true,
    hideFilterButton: true,
    primaryAction: { label: "Activate Offer", type: "submit", form: "create-promotion-form", iconSrc: "/images/dashboard/activate-offer.svg" },
    secondaryAction: { label: "Save draft", type: "button", iconSrc: "/images/dashboard/save2.svg" },
  },
  "/dashboard/reviews": {
    title: "Reviews & Testimonials",
    subtitle: "Moderate customer reviews, reply officially, and feature the best ones on the homepage.",
    breadcrumbTrail: [{ label: "Reviews" }, { label: "User Reviews" }],
    searchPlaceholder: "Search bookings, customers...",
    primaryAction: { label: "Add New Testimonial" },
    hideFilterButton: true,
  },
  "/dashboard/seo": {
    title: "SEO Configuration",
    subtitle: "Manage page content, metadata, social previews, structured data, and analytics.",
    breadcrumbTrail: [{ label: "SEO Configuration" }],
    searchPlaceholder: "Search bookings, customers...",
    hideFilterButton: true,
  },
};
export default pageCopyByPath;

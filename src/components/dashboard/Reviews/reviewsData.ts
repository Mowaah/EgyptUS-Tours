import type { ReviewRow, ReviewSummaryMetric } from "./types";

export const reviewSummaryMetrics: ReviewSummaryMetric[] = [
  {
    label: "Total Reviews",
    value: "40",
    change: "+8.2%",
    trend: "up",
    tone: "green",
    icon: "total-reviews",
  },
  {
    label: "Approved",
    value: "10",
    change: "+8.2%",
    trend: "up",
    tone: "blue",
    icon: "approved",
  },
  {
    label: "Pending",
    value: "30",
    change: "-5.1%",
    trend: "down",
    tone: "pink",
    icon: "pending",
  },
  {
    label: "Featured",
    value: "4",
    change: "-5.1%",
    trend: "down",
    tone: "orange",
    icon: "featured",
  },
];

const baseReviews: Omit<ReviewRow, "id">[] = [
  {
    customer: "Ahmed Hassan",
    category: "Trips",
    title: "Perfect in every way",
    rating: 4,
    date: "Mar 15, 2024",
    status: "Pending",
    featured: true,
  },
  {
    customer: "Linda Blair",
    category: "Transportation",
    title: "Perfect in every way",
    rating: 4,
    date: "Mar 15, 2024",
    status: "Pending",
    featured: false,
  },
  {
    customer: "Mohammad Karim",
    category: "Hotels",
    title: "Perfect in every way",
    rating: 4,
    date: "Mar 15, 2024",
    status: "Replied",
    featured: false,
  },
  {
    customer: "Ilham Budi Agung",
    category: "Trips",
    title: "Perfect in every way",
    rating: 4,
    date: "Mar 15, 2024",
    status: "Replied",
    featured: false,
  },
  {
    customer: "John Bushmill",
    category: "Transportation",
    title: "Perfect in every way",
    rating: 4,
    date: "Mar 15, 2024",
    status: "Replied",
    featured: true,
  },
  {
    customer: "Linda Blair",
    category: "Hotels",
    title: "Perfect in every way",
    rating: 4,
    date: "Mar 15, 2024",
    status: "Replied",
    featured: false,
  },
  {
    customer: "Josh Adam",
    category: "Trips",
    title: "Perfect in every way",
    rating: 4,
    date: "Mar 15, 2024",
    status: "Replied",
    featured: true,
  },
];

export const mockReviews: ReviewRow[] = Array.from({ length: 15 }, (_, index) => ({
  ...baseReviews[index % baseReviews.length],
  id: `REV-${String(index + 1).padStart(3, "0")}`,
  featured: index % 3 === 0,
}));

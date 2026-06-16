export type ReviewCategory = "Trips" | "Transportation" | "Hotels";
export type ReviewStatus = "Pending" | "Replied";
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface ReviewRow {
  id: string;
  customer: string;
  category: ReviewCategory;
  title: string;
  rating: ReviewRating;
  date: string;
  status: ReviewStatus;
  featured: boolean;
}

export interface ReviewSummaryMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  tone: "blue" | "orange" | "pink" | "purple";
  icon: string;
}

export interface MarketingPostRow {
  id: string;
  postId: string;
  title: string;
  category: string;
  publishDate?: string;
  date?: string;
  published_at?: string;
  views?: number;
  status: "Draft" | "Scheduled" | "Published";
  slug?: string;
}

export type ContentType = "articles" | "blog";

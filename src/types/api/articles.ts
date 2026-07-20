export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  article_count?: number;
}

export interface ArticleTag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  text_color?: string;
}

export interface ArticleList {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content_kind: 'article' | 'blog' | string;
  category_label?: string;
  category_color?: string;
  tag?: string;
  tag_color?: string;
  hero_image: string;
  featured_image: string;
  category: ArticleCategory;
  tags: ArticleTag[];
  display_author_name: string;
  display_author_title: string;
  author_image: string;
  read_time_minutes: number;
  is_featured: boolean;
  is_editors_pick: boolean;
  published_at: string;
  date: string;
}

export interface ArticleDetail extends ArticleList {
  content: string; // The HTML content
}

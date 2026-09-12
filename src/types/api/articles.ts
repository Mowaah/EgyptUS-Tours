export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  article_count?: number;
  translations?: Record<string, { name?: string; slug?: string } | undefined>;
}

export interface ArticleTag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  text_color?: string;
  translations?: Record<string, { name?: string; slug?: string } | undefined>;
}

export interface ArticleTranslation {
  title?: string;
  short_description?: string;
  excerpt?: string;
  content?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  image_title?: string;
  image_alt?: string;
  thumbnail_title?: string;
  thumbnail_alt?: string;
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
  translations?: Record<string, ArticleTranslation | undefined>;
}

export interface ArticleDetail extends ArticleList {
  content: string; // The HTML content
  intro?: string;
  hero_caption?: string;
  image_title?: string;
  image_alt?: string;
  thumbnail_title?: string;
  thumbnail_alt?: string;
  author_name?: string;
  author_role?: string;
  author_bio?: string;
  views_count?: number;
  detail_tags?: { id: number; label: string }[];
  faqs?: { question: string; answer: string }[];
}

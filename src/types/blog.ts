export interface Blog {
  id: string;
  category: string;
  categoryColor?: "blue" | "orange";
  title: string;
  excerpt: string;
  date: string;
  image: string;
  translations?: Record<
    string,
    {
      title?: string;
      short_description?: string;
      excerpt?: string;
      content?: string;
      slug?: string;
    } | undefined
  >;
  categoryTranslations?: Record<string, { name?: string; slug?: string } | undefined>;
}


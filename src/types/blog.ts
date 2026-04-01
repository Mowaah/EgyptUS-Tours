export interface Blog {
  id: string;
  category: string;
  categoryColor?: "blue" | "orange";
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

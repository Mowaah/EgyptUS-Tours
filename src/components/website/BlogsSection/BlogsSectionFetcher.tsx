import BlogsSection from "./BlogsSection";
import { getLatestBlogs } from "@/services/blogsService";
import { Blog } from "@/types";

export default async function BlogsSectionFetcher() {
  const latestBlogsApi = await getLatestBlogs();
  
  const initialBlogs: Blog[] = (latestBlogsApi || []).slice(0, 4).map(b => ({
    id: b.slug || String(b.id),
    category: b.category?.name || b.category_label || "Blog",
    categoryColor: (b.category_color === "orange" ? "orange" : "blue") as "blue" | "orange",
    title: b.title,
    excerpt: b.excerpt || b.subtitle || "",
    date: new Date(b.published_at || b.date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }),
    image: b.hero_image || b.featured_image || "/images/home/hero-bg.png",
  }));

  return <BlogsSection blogs={initialBlogs} />;
}

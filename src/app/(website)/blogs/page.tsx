import BlogsPage from "@/components/website/BlogsPage/BlogsPage";
import { getAllBlogs, getFeaturedBlogs } from "@/services/blogsService";

export const metadata = {
  title: "Blogs | Egypt US Tours",
  description: "Explore the heart of every destination through our latest insights and travel stories.",
};

export default async function Page() {
  const [blogsRes, featuredBlogs] = await Promise.all([
    getAllBlogs(),
    getFeaturedBlogs()
  ]);

  return <BlogsPage initialBlogs={blogsRes || []} initialFeatured={featuredBlogs} />;
}

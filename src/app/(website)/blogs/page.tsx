import BlogsPage from "@/components/website/BlogsPage/BlogsPage";
import { getAllBlogs, getFeaturedBlogs } from "@/services/blogsService";
import { getFaqs } from "@/services/legalHelpService";

export const metadata = {
  title: "Blogs | Egypt-Us",
  description: "Explore the heart of every destination through our latest insights and travel stories.",
};

export default async function Page() {
  const [blogsRes, featuredBlogs, faqs] = await Promise.all([
    getAllBlogs(),
    getFeaturedBlogs(),
    getFaqs()
  ]);

  return <BlogsPage initialBlogs={blogsRes || []} initialFeatured={featuredBlogs} initialFaqs={faqs} />;
}

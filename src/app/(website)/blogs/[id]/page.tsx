import ArticleDetailPage, { ArticleContent } from "@/components/website/ArticleDetailPage/ArticleDetailPage";
import { getBlogBySlug, getAllBlogs } from "@/services/blogsService";
import { notFound } from "next/navigation";

import { Metadata } from "next";

interface BlogDetailRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogDetailRouteProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  try {
    const blog = await getBlogBySlug(slug) as any;
    
    return {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.excerpt || "",
      keywords: blog.meta_keywords || "",
      openGraph: {
        title: blog.meta_title || blog.title,
        description: blog.meta_description || blog.excerpt || "",
        images: [blog.hero_image || blog.featured_image || "/images/home/hero-bg.png"],
      },
    };
  } catch (err) {
    return {
      title: "Blog Not Found",
    };
  }
}

export default async function BlogDetailRoute({ params }: BlogDetailRouteProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  
  try {
    const [blogResponse, allBlogs] = await Promise.all([
      getBlogBySlug(slug),
      getAllBlogs()
    ]);
    const blog = blogResponse as any;
    
    // Get 3 random blogs excluding current one
    const randomBlogs = allBlogs
      .filter(b => b.slug !== slug)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const content: ArticleContent = {
      id: blog.slug,
      tag: blog.category?.name || "Blog",
      tagColor: "blue",
      title: blog.title,
      author: blog.author_name || blog.display_author_name,
      authorRole: blog.author_role || blog.display_author_title || "",
      authorBio: blog.author_bio || "",
      date: new Date(blog.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      readTime: `${blog.read_time_minutes} min`,
      views: `${blog.views_count || 0}`,
      heroImage: blog.hero_image || blog.featured_image || "/images/home/hero-bg.png",
      heroCaption: blog.image_title || "",
      imageAlt: blog.image_alt || blog.title,
      htmlContent: blog.content || "",
      intro: blog.intro || blog.excerpt || "",
      tags: (blog.detail_tags || []).map((t: any) => t.label),
      faqs: blog.faqs || [],
      relatedArticles: randomBlogs.map((rb) => ({
        id: rb.slug,
        title: rb.title,
        date: new Date(rb.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        image: rb.featured_image || "/images/article.jpg",
        href: `/blogs/${rb.slug}`
      })),
      breadcrumbs: [
        { label: "Blogs", href: "/blogs" },
        { label: blog.title, isCurrent: true }
      ],
      type: "blog"
    };

    return <ArticleDetailPage content={content} />;
  } catch (err) {
    notFound();
  }
}

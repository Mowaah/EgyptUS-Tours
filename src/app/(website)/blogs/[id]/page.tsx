import ArticleDetailPage, { ArticleContent } from "@/components/website/ArticleDetailPage/ArticleDetailPage";
import { getBlogBySlug, getAllBlogs } from "@/services/blogsService";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { normalizeLanguage, getTranslation } from "@/i18n";
import { getBackendLocalizedArticle, getBackendLocalizedName } from "@/utils/localizedContent";

import { Metadata } from "next";

interface BlogDetailRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogDetailRouteProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  const cookieStore = await cookies();
  const lang = normalizeLanguage(cookieStore.get("egyptus_lang")?.value);

  try {
    const blog = await getBlogBySlug(slug) as any;
    const loc = getBackendLocalizedArticle(blog, lang);
    const title = loc.title || blog.meta_title || blog.title;
    const description = loc.excerpt || blog.meta_description || blog.excerpt || "";
    
    return {
      title,
      description,
      keywords: blog.meta_keywords || "",
      openGraph: {
        title,
        description,
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
  const cookieStore = await cookies();
  const lang = normalizeLanguage(cookieStore.get("egyptus_lang")?.value);
  const localeCode = lang === "it" ? "it-IT" : lang === "es" ? "es-ES" : "en-GB";
  
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

    const loc = getBackendLocalizedArticle(blog, lang);
    const categoryName = getBackendLocalizedName(blog.category, lang, blog.category?.name || "Blog");
    const blogTitle = loc.title || blog.title;
    const blogIntro = loc.intro || loc.excerpt || blog.intro || blog.excerpt || "";
    const blogContent = loc.content || blog.content || "";
    const blogsBreadcrumb = getTranslation(lang, "common", "footer.blogs") || "Blogs";
    
    const content: ArticleContent = {
      id: blog.slug,
      tag: categoryName,
      tagColor: "blue",
      title: blogTitle,
      author: blog.author_name || blog.display_author_name,
      authorRole: blog.author_role || blog.display_author_title || "",
      authorBio: blog.author_bio || "",
      date: new Date(blog.published_at).toLocaleDateString(localeCode, { day: '2-digit', month: 'long', year: 'numeric' }),
      readTime: `${blog.read_time_minutes} min`,
      views: `${blog.views_count || 0}`,
      heroImage: blog.hero_image || blog.featured_image || "/images/home/hero-bg.png",
      heroCaption: loc.imageTitle || blog.image_title || "",
      imageAlt: loc.imageAlt || blog.image_alt || blogTitle,
      htmlContent: blogContent,
      intro: blogIntro,
      tags: (blog.detail_tags || []).map((t: any) => t.label),
      faqs: blog.faqs || [],
      relatedArticles: randomBlogs.map((rb) => {
        const rloc = getBackendLocalizedArticle(rb, lang);
        return {
          id: rb.slug,
          title: rloc.title || rb.title,
          date: new Date(rb.published_at).toLocaleDateString(localeCode, { day: '2-digit', month: 'long', year: 'numeric' }),
          image: rb.featured_image || rb.hero_image || "/images/article.jpg",
          href: `/blogs/${rb.slug}`
        };
      }),
      breadcrumbs: [
        { label: blogsBreadcrumb, href: "/blogs" },
        { label: blogTitle, isCurrent: true }
      ],
      type: "blog"
    };

    return <ArticleDetailPage content={content} />;
  } catch (err) {
    notFound();
  }
}

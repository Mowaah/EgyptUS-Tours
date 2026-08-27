import ArticleDetailPage, { ArticleContent } from "@/components/website/ArticleDetailPage/ArticleDetailPage";
import { getArticleBySlug, getAllArticles } from "@/services/articlesService";
import { notFound } from "next/navigation";

import { Metadata } from "next";

interface ArticleDetailRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ArticleDetailRouteProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  try {
    const article = await getArticleBySlug(slug) as any;
    
    return {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || "",
      keywords: article.meta_keywords || "",
      openGraph: {
        title: article.meta_title || article.title,
        description: article.meta_description || article.excerpt || "",
        images: [article.hero_image || article.featured_image || "/images/home/hero-bg.png"],
      },
    };
  } catch (err) {
    return {
      title: "Article Not Found",
    };
  }
}

export default async function ArticleDetailRoute({ params }: ArticleDetailRouteProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  
  try {
    const [articleResponse, allArticles] = await Promise.all([
      getArticleBySlug(slug),
      getAllArticles()
    ]);
    const article = articleResponse as any;
    
    // Get 3 random articles excluding current one
    const randomArticles = allArticles
      .filter(a => a.slug !== slug)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const content: ArticleContent = {
      id: article.slug,
      tag: article.category?.name || "Article",
      tagColor: "blue",
      title: article.title,
      author: article.author_name || article.display_author_name,
      authorRole: article.author_role || article.display_author_title || "",
      authorBio: article.author_bio || "",
      date: new Date(article.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      readTime: `${article.read_time_minutes} min`,
      views: `${article.views_count || 0}`,
      heroImage: article.hero_image || article.featured_image || "/images/home/hero-bg.png",
      heroCaption: article.hero_caption || "",
      intro: article.intro || article.excerpt || "",
      primaryQuote: article.primary_quote || "",
      sections: (article.sections || []).map((s: any) => ({
        h2: s.h2,
        h3: s.h3,
        paragraphs: s.paragraphs || [],
        quote: s.quote,
        quoteVariant: s.quote_color === "orange" ? "orange" : "blue"
      })),
      tags: (article.detail_tags || []).map((t: any) => t.label),
      faqs: article.faqs || [],
      relatedArticles: randomArticles.map((ra) => ({
        id: ra.slug,
        title: ra.title,
        date: new Date(ra.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        image: ra.featured_image || "/images/article.jpg",
        href: `/articles/${ra.slug}`
      })),
      breadcrumbs: [
        { label: "Articles", href: "/articles" },
        { label: article.title, isCurrent: true }
      ],
      type: "article"
    };

    return <ArticleDetailPage content={content} />;
  } catch (err) {
    notFound();
  }
}

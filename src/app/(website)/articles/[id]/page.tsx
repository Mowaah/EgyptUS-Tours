import ArticleDetailPage, { ArticleContent } from "@/components/website/ArticleDetailPage/ArticleDetailPage";
import { getArticleBySlug, getAllArticles } from "@/services/articlesService";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { normalizeLanguage, getTranslation } from "@/i18n";
import { getBackendLocalizedArticle, getBackendLocalizedName } from "@/utils/localizedContent";

import { Metadata } from "next";

interface ArticleDetailRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ArticleDetailRouteProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  const cookieStore = await cookies();
  const lang = normalizeLanguage(cookieStore.get("egyptus_lang")?.value);

  try {
    const article = await getArticleBySlug(slug) as any;
    const loc = getBackendLocalizedArticle(article, lang);
    const title = loc.title || article.meta_title || article.title;
    const description = loc.excerpt || article.meta_description || article.excerpt || "";
    
    return {
      title,
      description,
      keywords: article.meta_keywords || "",
      openGraph: {
        title,
        description,
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
  const cookieStore = await cookies();
  const lang = normalizeLanguage(cookieStore.get("egyptus_lang")?.value);
  const localeCode = lang === "it" ? "it-IT" : lang === "es" ? "es-ES" : "en-GB";
  
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

    const loc = getBackendLocalizedArticle(article, lang);
    const categoryName = getBackendLocalizedName(article.category, lang, article.category?.name || "Article");
    const articleTitle = loc.title || article.title;
    const articleIntro = loc.intro || loc.excerpt || article.intro || article.excerpt || "";
    const articleContent = loc.content || article.content || "";
    const articlesBreadcrumb = getTranslation(lang, "common", "footer.articles") || "Articles";
    
    const content: ArticleContent = {
      id: article.slug,
      tag: categoryName,
      tagColor: "blue",
      title: articleTitle,
      author: article.author_name || article.display_author_name,
      authorRole: article.author_role || article.display_author_title || "",
      authorBio: article.author_bio || "",
      date: new Date(article.published_at).toLocaleDateString(localeCode, { day: '2-digit', month: 'long', year: 'numeric' }),
      readTime: `${article.read_time_minutes} min`,
      views: `${article.views_count || 0}`,
      heroImage: article.hero_image || article.featured_image || "/images/home/hero-bg.png",
      heroCaption: loc.imageTitle || article.image_title || "",
      imageAlt: loc.imageAlt || article.image_alt || articleTitle,
      htmlContent: articleContent,
      intro: articleIntro,
      tags: (article.detail_tags || []).map((t: any) => t.label),
      faqs: article.faqs || [],
      relatedArticles: randomArticles.map((ra) => {
        const rloc = getBackendLocalizedArticle(ra, lang);
        return {
          id: ra.slug,
          title: rloc.title || ra.title,
          date: new Date(ra.published_at).toLocaleDateString(localeCode, { day: '2-digit', month: 'long', year: 'numeric' }),
          image: ra.featured_image || ra.hero_image || "/images/article.jpg",
          href: `/articles/${ra.slug}`
        };
      }),
      breadcrumbs: [
        { label: articlesBreadcrumb, href: "/articles" },
        { label: articleTitle, isCurrent: true }
      ],
      type: "article"
    };

    return <ArticleDetailPage content={content} />;
  } catch (err) {
    notFound();
  }
}

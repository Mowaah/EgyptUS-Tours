import ArticlesPage from "@/components/website/ArticlesPage/ArticlesPage";
import { Metadata } from "next";

import { getAllArticles, getFeaturedArticles } from "@/services/articlesService";
import { getFaqs } from "@/services/legalHelpService";

export const metadata: Metadata = {
  title: "Articles | EgyptUS Tours",
  description: "Explore our insider guides and professional tips.",
};

export default async function Page() {
  const [articlesRes, featuredArticles, faqs] = await Promise.all([
    getAllArticles(),
    getFeaturedArticles(),
    getFaqs()
  ]);

  return <ArticlesPage initialArticles={articlesRes || []} initialFeatured={featuredArticles} initialFaqs={faqs} />;
}

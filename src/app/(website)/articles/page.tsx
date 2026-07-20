import ArticlesPage from "@/components/website/ArticlesPage/ArticlesPage";
import { Metadata } from "next";

import { getAllArticles, getFeaturedArticles } from "@/services/articlesService";

export const metadata: Metadata = {
  title: "Articles | EgyptUS Tours",
  description: "Explore our insider guides and professional tips.",
};

export default async function Page() {
  const [articlesRes, featuredArticles] = await Promise.all([
    getAllArticles(),
    getFeaturedArticles()
  ]);

  return <ArticlesPage initialArticles={articlesRes || []} initialFeatured={featuredArticles} />;
}

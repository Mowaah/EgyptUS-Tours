import ArticlesPage from "@/components/website/ArticlesPage/ArticlesPage";
import { Metadata } from "next";

import { getAllArticles } from "@/services/articlesService";
import { getFaqs } from "@/services/legalHelpService";

export const metadata: Metadata = {
  title: "Articles | Egypt-Us",
  description: "Explore our insider guides and professional tips.",
};

export default async function Page() {
  const [articlesRes, faqs] = await Promise.all([
    getAllArticles(),
    getFaqs()
  ]);

  return <ArticlesPage initialArticles={articlesRes || []} initialFaqs={faqs} />;
}

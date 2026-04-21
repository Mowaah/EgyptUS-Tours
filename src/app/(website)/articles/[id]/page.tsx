import ArticleDetailPage from "@/components/website/ArticleDetailPage/ArticleDetailPage";
import { ARTICLE_MOCK } from "@/components/website/ArticleDetailPage/mockData";

interface ArticleDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailRoute({ params }: ArticleDetailRouteProps) {
  // In the future, use `params.id` to fetch the real article from the API
  await params;
  return <ArticleDetailPage content={ARTICLE_MOCK} />;
}

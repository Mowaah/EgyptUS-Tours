import ArticleDetailPage from "@/components/website/ArticleDetailPage/ArticleDetailPage";
import { BLOG_MOCK } from "@/components/website/ArticleDetailPage/mockData";

interface BlogDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailRoute({ params }: BlogDetailRouteProps) {
  // In the future, use `params.id` to fetch the real blog from the API
  await params;
  return <ArticleDetailPage content={BLOG_MOCK} />;
}

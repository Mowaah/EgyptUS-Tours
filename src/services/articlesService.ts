import { serverFetch, apiClient, getFullImageUrl } from '@/lib/api';
import { PaginatedResponse } from '@/types/api/index';
import { ArticleList, ArticleDetail } from '@/types/api/articles';
import { toArticleSlug } from '@/utils/articleSlug';

const mapArticleImages = <T extends Partial<ArticleDetail & ArticleList>>(article: T): T => {
  if (article.hero_image) article.hero_image = getFullImageUrl(article.hero_image);
  if (article.featured_image) article.featured_image = getFullImageUrl(article.featured_image);
  return article;
};

// Fetch all articles (Paginated)
export async function getArticles(params?: Record<string, any>): Promise<PaginatedResponse<ArticleList>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const response = await serverFetch<PaginatedResponse<ArticleList>>(`/articles/${query}`, { next: { revalidate: 60 } });
  response.results = response.results.map(mapArticleImages);
  return response;
}

// Fetch all articles across all pages
export async function getAllArticles(): Promise<ArticleList[]> {
  const firstPage = await getArticles();
  const results = [...firstPage.results];
  const totalPages = Math.ceil(firstPage.count / 10);
  
  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(getArticles({ page: i }));
    }
    const pages = await Promise.all(promises);
    pages.forEach(p => results.push(...p.results));
  }
  
  return results;
}

// Fetch a single article by slug
export async function getArticleBySlug(slug: string): Promise<ArticleDetail> {
  try {
    const response = await serverFetch<ArticleDetail>(`/articles/${encodeURIComponent(slug)}/`, { next: { revalidate: 60 } });
    return mapArticleImages(response);
  } catch (error) {
    const articles = await getAllArticles();
    const match = articles.find((article) => toArticleSlug(article.slug) === toArticleSlug(slug));
    if (!match) throw error;

    const response = await serverFetch<ArticleDetail>(`/articles/${encodeURIComponent(match.slug)}/`, { next: { revalidate: 60 } });
    return mapArticleImages(response);
  }
}

// Fetch featured articles
export async function getFeaturedArticles(): Promise<ArticleList[]> {
  const response = await serverFetch<ArticleList[]>('/articles/featured/', { next: { revalidate: 60 } });
  return response.map(mapArticleImages);
}

// Fetch editors pick articles
export async function getEditorsPickArticles(): Promise<ArticleList[]> {
  const response = await serverFetch<ArticleList[]>('/articles/editors-picks/', { next: { revalidate: 60 } });
  return response.map(mapArticleImages);
}

// Fetch latest articles
export async function getLatestArticles(): Promise<ArticleList[]> {
  const response = await serverFetch<ArticleList[]>('/articles/latest/', { next: { revalidate: 60 } });
  return response.map(mapArticleImages);
}

// Client-side version for infinite scroll or client-side filtering if needed
export async function getArticlesClient(params?: Record<string, any>): Promise<PaginatedResponse<ArticleList>> {
  const response = await apiClient.get<PaginatedResponse<ArticleList>>('/articles/', { params });
  const paginated = response as unknown as PaginatedResponse<ArticleList>;
  paginated.results = paginated.results.map(mapArticleImages);
  return paginated;
}

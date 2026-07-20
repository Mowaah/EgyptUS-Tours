import { serverFetch, apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/api/index';
import { ArticleList, ArticleDetail } from '@/types/api/articles';

// Fetch all articles (Paginated)
export async function getArticles(params?: Record<string, any>): Promise<PaginatedResponse<ArticleList>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return serverFetch<PaginatedResponse<ArticleList>>(`/articles/${query}`);
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
  return serverFetch<ArticleDetail>(`/articles/${slug}/`);
}

// Fetch featured articles
export async function getFeaturedArticles(): Promise<ArticleList[]> {
  return serverFetch<ArticleList[]>('/articles/featured/');
}

// Fetch editors pick articles
export async function getEditorsPickArticles(): Promise<ArticleList[]> {
  return serverFetch<ArticleList[]>('/articles/editors-picks/');
}

// Fetch latest articles
export async function getLatestArticles(): Promise<ArticleList[]> {
  return serverFetch<ArticleList[]>('/articles/latest/');
}

// Client-side version for infinite scroll or client-side filtering if needed
export async function getArticlesClient(params?: Record<string, any>): Promise<PaginatedResponse<ArticleList>> {
  const response = await apiClient.get<PaginatedResponse<ArticleList>>('/articles/', { params });
  return response as unknown as PaginatedResponse<ArticleList>;
}

import { serverFetch, apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/api/index';
import { ArticleList, ArticleDetail } from '@/types/api/articles';

// Fetch all blogs (Paginated)
export async function getBlogs(params?: Record<string, any>): Promise<PaginatedResponse<ArticleList>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return serverFetch<PaginatedResponse<ArticleList>>(`/blogs/${query}`);
}

// Fetch all blogs across all pages
export async function getAllBlogs(): Promise<ArticleList[]> {
  const firstPage = await getBlogs();
  const results = [...firstPage.results];
  const totalPages = Math.ceil(firstPage.count / 10);
  
  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(getBlogs({ page: i }));
    }
    const pages = await Promise.all(promises);
    pages.forEach(p => results.push(...p.results));
  }
  
  return results;
}

// Fetch a single blog by slug
export async function getBlogBySlug(slug: string): Promise<ArticleDetail> {
  return serverFetch<ArticleDetail>(`/blogs/${slug}/`);
}

// Fetch featured blogs
export async function getFeaturedBlogs(): Promise<ArticleList[]> {
  return serverFetch<ArticleList[]>('/blogs/featured/');
}

// Fetch editors pick blogs
export async function getEditorsPickBlogs(): Promise<ArticleList[]> {
  return serverFetch<ArticleList[]>('/blogs/editors-picks/');
}

// Fetch latest blogs
export async function getLatestBlogs(): Promise<ArticleList[]> {
  return serverFetch<ArticleList[]>('/blogs/latest/');
}

// Client-side version
export async function getBlogsClient(params?: Record<string, any>): Promise<PaginatedResponse<ArticleList>> {
  const response = await apiClient.get<PaginatedResponse<ArticleList>>('/blogs/', { params });
  return response as unknown as PaginatedResponse<ArticleList>;
}

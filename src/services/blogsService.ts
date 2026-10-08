import { serverFetch, apiClient, getFullImageUrl } from '@/lib/api';
import { PaginatedResponse } from '@/types/api/index';
import { ArticleList, ArticleDetail } from '@/types/api/articles';
import { toArticleSlug } from '@/utils/articleSlug';

const mapBlogImages = <T extends Partial<ArticleDetail & ArticleList>>(blog: T): T => {
  if (blog.hero_image) blog.hero_image = getFullImageUrl(blog.hero_image);
  if (blog.featured_image) blog.featured_image = getFullImageUrl(blog.featured_image);
  return blog;
};

// Fetch all blogs (Paginated)
export async function getBlogs(params?: Record<string, any>): Promise<PaginatedResponse<ArticleList>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const response = await serverFetch<PaginatedResponse<ArticleList>>(`/blogs/${query}`, { next: { revalidate: 60 } });
  response.results = response.results.map(mapBlogImages);
  return response;
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
  try {
    const response = await serverFetch<ArticleDetail>(`/blogs/${encodeURIComponent(slug)}/`, { next: { revalidate: 60 } });
    return mapBlogImages(response);
  } catch (error) {
    const blogs = await getAllBlogs();
    const match = blogs.find((blog) => toArticleSlug(blog.slug) === toArticleSlug(slug));
    if (!match) throw error;

    const response = await serverFetch<ArticleDetail>(`/blogs/${encodeURIComponent(match.slug)}/`, { next: { revalidate: 60 } });
    return mapBlogImages(response);
  }
}

// Fetch featured blogs
export async function getFeaturedBlogs(): Promise<ArticleList[]> {
  const response = await serverFetch<ArticleList[]>('/blogs/featured/', { next: { revalidate: 60 } });
  return response.map(mapBlogImages);
}

// Fetch editors pick blogs
export async function getEditorsPickBlogs(): Promise<ArticleList[]> {
  const response = await serverFetch<ArticleList[]>('/blogs/editors-picks/', { next: { revalidate: 60 } });
  return response.map(mapBlogImages);
}

// Fetch latest blogs
export async function getLatestBlogs(): Promise<ArticleList[]> {
  const response = await serverFetch<ArticleList[]>('/blogs/latest/', { next: { revalidate: 60 } });
  return response.map(mapBlogImages);
}

// Client-side version
export async function getBlogsClient(params?: Record<string, any>): Promise<PaginatedResponse<ArticleList>> {
  const response = await apiClient.get<PaginatedResponse<ArticleList>>('/blogs/', { params });
  const paginated = response as unknown as PaginatedResponse<ArticleList>;
  paginated.results = paginated.results.map(mapBlogImages);
  return paginated;
}

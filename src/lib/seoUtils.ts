import type { Metadata } from "next";
import { getPublicSeoConfig } from "@/services/seoService";
import { getFullImageUrl } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://egypt-us.com";

interface SeoMetadataOptions {
  pageKey: string;
  /** Fallback title if the backend has no config. */
  fallbackTitle?: string;
  /** Fallback description if the backend has no config. */
  fallbackDescription?: string;
}

/**
 * Shared utility to build Next.js Metadata from the backend SEO config.
 * Wires up: title, description, keywords, canonical URL (from slug), OG image, Twitter card.
 *
 * @example
 * export async function generateMetadata(): Promise<Metadata> {
 *   return generateSeoMetadata({ pageKey: "home", fallbackTitle: "Egypt-Us" });
 * }
 */
export async function generateSeoMetadata({
  pageKey,
  fallbackTitle = "Egypt-Us",
  fallbackDescription = "Discover the best tours and travel experiences in Egypt.",
}: SeoMetadataOptions): Promise<Metadata> {
  const config = await getPublicSeoConfig(pageKey);

  const title = config?.meta_title || fallbackTitle;
  const description = config?.meta_description || fallbackDescription;
  const keywords = config?.meta_keywords?.length ? config.meta_keywords : undefined;
  const ogImage = config?.og_image ? getFullImageUrl(config.og_image) : undefined;
  const ogImageAlt = config?.image_alt || title;

  // Build canonical URL from slug:
  //   "" or undefined → site root  (e.g. https://egypt-us.com)
  //   "trips"         → sub-path   (e.g. https://egypt-us.com/trips)
  const slug = config?.slug?.replace(/^\/+|\/+$/g, "") ?? null; // strip stray slashes
  const canonicalUrl =
    slug !== null
      ? slug === ""
        ? SITE_URL                          // home page
        : `${SITE_URL}/${slug}`             // all other pages
      : undefined;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      ...(ogImage ? { images: [{ url: ogImage, alt: ogImageAlt }] } : {}),
      type: "website",
      siteName: "Egypt-Us",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export interface DynamicSeoItem {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | string[] | null;
  slug?: string | null;
  title?: string | null; 
  name?: string | null; 
  description?: string | null; 
  short_description?: string | null; 
  image?: string | null; 
  hero_image?: string | null;
}

export function generateDynamicSeoMetadata(
  item: DynamicSeoItem | null,
  routePrefix: string = "", // e.g. "trips"
  fallbackTitle: string = "Egypt-Us"
): Metadata {
  if (!item) {
    return { title: fallbackTitle };
  }

  const title = item.meta_title || item.title || item.name || fallbackTitle;
  const description = item.meta_description || item.description || item.short_description || "";
  
  let keywords: string | string[] | undefined = item.meta_keywords || undefined;
  if (typeof keywords === "string") {
    keywords = keywords.split(",").map((k) => k.trim()).filter(Boolean);
  }

  const ogImageRaw = item.image || item.hero_image;
  const ogImage = ogImageRaw ? getFullImageUrl(ogImageRaw) : undefined;
  const ogImageAlt = title;

  const slug = item.slug?.replace(/^\/+|\/+$/g, "") ?? null;
  
  let canonicalUrl: string | undefined = undefined;
  if (slug) {
    const pathParts = [SITE_URL];
    if (routePrefix) pathParts.push(routePrefix);
    pathParts.push(slug);
    canonicalUrl = pathParts.join("/");
  }

  return {
    title: title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      ...(ogImage ? { images: [{ url: ogImage, alt: ogImageAlt }] } : {}),
      type: "website",
      siteName: "Egypt-Us",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

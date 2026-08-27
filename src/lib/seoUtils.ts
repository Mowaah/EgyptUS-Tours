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

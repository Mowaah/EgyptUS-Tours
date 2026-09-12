import { SupportedLanguage, DEFAULT_LANGUAGE } from "@/i18n/types";

export interface TranslatableItem {
  name?: string;
  title?: string;
  translations?: Record<string, { name?: string; title?: string } | undefined>;
}

/**
 * Extracts the localized name/title from a backend item containing a translations dictionary.
 * Priority: translations[locale] -> translations['en'] -> item.name / item.title -> fallback.
 */
export function getBackendLocalizedName(
  item: TranslatableItem | string | null | undefined,
  locale: SupportedLanguage = DEFAULT_LANGUAGE,
  fallback = ""
): string {
  if (!item) return fallback;
  if (typeof item === "string") return item;
  const trans = item.translations?.[locale];
  const en = item.translations?.[DEFAULT_LANGUAGE];
  return trans?.name || trans?.title || en?.name || en?.title || item.name || item.title || fallback;
}

export interface TranslatableArticle {
  title?: string;
  excerpt?: string;
  intro?: string;
  content?: string;
  slug?: string;
  image_title?: string;
  image_alt?: string;
  thumbnail_title?: string;
  thumbnail_alt?: string;
  translations?: Record<
    string,
    {
      title?: string;
      short_description?: string;
      excerpt?: string;
      intro?: string;
      content?: string;
      slug?: string;
      image_title?: string;
      image_alt?: string;
      thumbnail_title?: string;
      thumbnail_alt?: string;
    } | undefined
  >;
}

/**
 * Extracts localized article attributes (title, excerpt, content, slug, etc.) from backend translations.
 * Priority: translations[locale] -> translations['en'] -> model root field.
 */
export function getBackendLocalizedArticle(
  article: TranslatableArticle | null | undefined,
  locale: SupportedLanguage = DEFAULT_LANGUAGE
) {
  if (!article) {
    return {
      title: "",
      excerpt: "",
      intro: "",
      content: "",
      slug: "",
      imageTitle: "",
      imageAlt: "",
      thumbnailTitle: "",
      thumbnailAlt: "",
    };
  }
  const trans = article.translations?.[locale];
  const en = article.translations?.[DEFAULT_LANGUAGE];

  const title = trans?.title || en?.title || article.title || "";
  const excerpt =
    trans?.short_description ||
    trans?.excerpt ||
    trans?.intro ||
    en?.short_description ||
    en?.excerpt ||
    article.excerpt ||
    article.intro ||
    "";
  const intro =
    trans?.intro ||
    trans?.short_description ||
    en?.intro ||
    en?.short_description ||
    article.intro ||
    article.excerpt ||
    "";
  const content = trans?.content || en?.content || article.content || "";
  const slug = trans?.slug || en?.slug || article.slug || "";
  const imageTitle = trans?.image_title || en?.image_title || article.image_title || "";
  const imageAlt = trans?.image_alt || en?.image_alt || article.image_alt || title;
  const thumbnailTitle = trans?.thumbnail_title || en?.thumbnail_title || article.thumbnail_title || "";
  const thumbnailAlt = trans?.thumbnail_alt || en?.thumbnail_alt || article.thumbnail_alt || title;

  return {
    title,
    excerpt,
    intro,
    content,
    slug,
    imageTitle,
    imageAlt,
    thumbnailTitle,
    thumbnailAlt,
  };
}

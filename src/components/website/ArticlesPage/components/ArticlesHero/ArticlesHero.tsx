import { PageHeader, SearchContainer } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";

interface ArticlesHeroProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function ArticlesHero({ searchQuery, onSearch }: ArticlesHeroProps) {
  const { t } = useTranslation("common");

  return (
    <PageHeader
      breadcrumbs={[{ label: t("footer.articles", "Articles"), isCurrent: true }]}
      title={t("articles.gatewayTitle", "Your Gateway to Egypt")}
      subtitle={t(
        "articles.gatewaySubtitle",
        "Explore the heart of every destination. Our blog brings you closer to the people, places, and experiences that make traveling through Egypt truly unforgettable"
      )}
      subtitleMaxWidth="800px"
    >
      <div style={{ marginTop: "clamp(20px, 5vw, 48px)", width: "100%" }}>
        <SearchContainer
          placeholder={t("articles.searchPlaceholder", "Search Article here")}
          description={t(
            "articles.searchDescription",
            "Explore our insider guides and professional tips to make the most of every destination and elevate your travel experience"
          )}
          value={searchQuery}
          onSearch={onSearch}
        />
      </div>
    </PageHeader>
  );
}

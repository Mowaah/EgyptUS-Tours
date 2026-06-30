import { PageHeader, SearchContainer } from "@/components/shared";

interface BlogHeroProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function BlogHero({ searchQuery, onSearch }: BlogHeroProps) {
  return (
    <PageHeader
      breadcrumbs={[{ label: "Blogs", isCurrent: true }]}
      title="Your Gateway to Egypt"
      subtitle="Explore the heart of every destination. Our blog brings you closer to the people, places, and experiences that make traveling through Egypt truly unforgettable"
      subtitleMaxWidth="800px"
    >
      <div style={{ marginTop: "clamp(20px, 5vw, 48px)", width: "100%" }}>
        <SearchContainer 
          placeholder="Search blogs here"
          description="Explore our insider guides and professional tips to make the most of every destination and elevate your travel experience"
          value={searchQuery}
          onSearch={onSearch}
        />
      </div>
    </PageHeader>
  );
}

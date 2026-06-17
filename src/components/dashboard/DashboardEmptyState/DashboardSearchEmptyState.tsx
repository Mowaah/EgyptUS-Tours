"use client";

import DashboardEmptyState from "./DashboardEmptyState";

interface DashboardSearchEmptyStateProps {
  onClearSearch?: () => void;
}

export default function DashboardSearchEmptyState({ onClearSearch }: DashboardSearchEmptyStateProps) {
  return (
    <DashboardEmptyState
      title="No Results Found"
      subtitle="We couldn't find anything matching your search. Try using different keywords."
      actionLabel="Search Again"
      imageSrc="/images/dashboard/no-search-found.png"
      actionIconSrc="/images/dashboard/refresh.svg"
      onAction={onClearSearch}
    />
  );
}

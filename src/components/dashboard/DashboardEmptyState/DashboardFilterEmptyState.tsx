import DashboardEmptyState from "./DashboardEmptyState";

interface DashboardFilterEmptyStateProps {
  onClearFilters: () => void;
  title?: string;
  subtitle?: string;
}

export default function DashboardFilterEmptyState({ 
  onClearFilters,
  title = "No results found",
  subtitle = "Try adjusting your filters to find what you are looking for."
}: DashboardFilterEmptyStateProps) {
  return (
    <DashboardEmptyState
      title={title}
      subtitle={subtitle}
      actionLabel="Clear Filters"
      hideActionIcon={true}
      imageSrc="/images/dashboard/empty.png"
      onAction={onClearFilters}
    />
  );
}

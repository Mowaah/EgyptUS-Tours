import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import CatalogTabs from "@/components/dashboard/Catalog/CatalogTabs/CatalogTabs";
import TripsPanel from "@/components/dashboard/Catalog/Trips/TripsPanel/TripsPanel";
import styles from "./page.module.scss";

export default async function CatalogTripsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params?.search || "";

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Trips"
        subtitle="Manage all trip products visible on the website"
        primaryAction={{ label: "Add New Trip" }}
        searchQuery={searchQuery}
      />
      <div className={styles.content}>
        <CatalogTabs />
        <TripsPanel searchQuery={searchQuery} />
      </div>
    </div>
  );
}

import NotificationsPage from "@/components/dashboard/Notifications/NotificationsPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const initialSearch = params?.search || "";

  return <NotificationsPage initialSearch={initialSearch} />;
}

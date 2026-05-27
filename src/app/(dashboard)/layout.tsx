export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-dashboard-layout>{children}</div>;
}

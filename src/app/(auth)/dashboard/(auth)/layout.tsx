import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Egypt US Dashboard",
  description: "Access and manage your tourism platform",
};

export default function DashboardAuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-auth-layout>{children}</div>;
}

import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "EgyptUS Tours",
  description: "History, culture, and adventure all in one trip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

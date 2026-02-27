import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "3amo Travel",
  description: "Your travel agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

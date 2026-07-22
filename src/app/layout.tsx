import type { Metadata } from "next";


import ScrollToTop from "@/components/shared/ScrollToTop/ScrollToTop";
import ScrollAnimationProvider from "@/components/shared/ScrollAnimationProvider/ScrollAnimationProvider";
import { AuthProvider } from "@/contexts/AuthContext";
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
      <body suppressHydrationWarning>
        <AuthProvider>
          <ScrollToTop />
          <ScrollAnimationProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

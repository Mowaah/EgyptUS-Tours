import type { Metadata } from "next";


import ScrollToTop from "@/components/shared/ScrollToTop/ScrollToTop";
import ScrollAnimationProvider from "@/components/shared/ScrollAnimationProvider/ScrollAnimationProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.scss";

import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Egypt-Us",
  description: "History, culture, and luxury all in one trip",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("egyptus_lang")?.value || "en";

  return (
    <html lang={lang} suppressHydrationWarning>
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

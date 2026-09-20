import type { Metadata } from "next";


import ScrollToTop from "@/components/shared/ScrollToTop/ScrollToTop";
import ScrollAnimationProvider from "@/components/shared/ScrollAnimationProvider/ScrollAnimationProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.scss";

import Script from "next/script";
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
      <head>
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M92PRJC6');`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M92PRJC6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AuthProvider>
          <ScrollToTop />
          <ScrollAnimationProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

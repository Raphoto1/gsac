import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/utils/analytics/GoogleAnalytics";
import { SessionProvider } from "@/components/auth/SessionProvider";
import Nav from "@/components/nav/Nav";
import Footer from "@/components/footer/Footer";
import { siteConfig } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("seo")]);

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: t("defaultTitle"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("defaultDescription"),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "business",
    referrer: "origin-when-cross-origin",
    icons: {
      icon: [
        {
          url: "/img/favicon/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/img/favicon/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/img/favicon/favicon.ico",
          sizes: "any",
        },
      ],
      shortcut: ["/img/favicon/favicon.ico"],
      apple: [
        {
          url: "/img/favicon/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    manifest: "/img/favicon/site.webmanifest",
    keywords: [
      "consultoria empresarial",
      "soluciones empresariales",
      "optimizacion de procesos",
      "transformacion operativa",
      "GSAC",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      url: "/",
      siteName: siteConfig.name,
      locale: locale === "en" ? "en_US" : "es_ES",
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      images: [siteConfig.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full overflow-x-hidden antialiased`}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="flex min-h-full flex-col overflow-x-hidden">
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </SessionProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}

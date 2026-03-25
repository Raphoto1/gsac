import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/utils/analytics/GoogleAnalytics";
import { SessionProvider } from "@/components/auth/SessionProvider";
import Nav from "@/components/nav/Nav";
import Footer from "@/components/footer/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GSAC",
  description: "Global Services and Consulting",
};

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

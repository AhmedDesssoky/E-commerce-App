import type { ReactNode } from "react";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "@/i18n/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthToast } from "@/components/auth-toast";
import { Toaster } from "@/components/ui/toast";
import { routing } from "@/i18n/routing";
import "../globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  const t = await getTranslations("common.meta");

  return {
    title: {
      template: `%s | ${t("title")}`,
      default: t("title"),
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${ibmPlexSans.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink font-sans">
        <NextIntlClientProvider>
          <Navbar />
          <main id="main" className="flex min-w-0 flex-1 flex-col scroll-mt-16">
            {children}
          </main>
          <Footer />
          <Toaster />
          <AuthToast />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

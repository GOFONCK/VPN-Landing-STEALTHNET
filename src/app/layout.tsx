import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeStyles } from "@/components/ThemeStyles";
import { getSiteInfo } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();
  const siteUrl = siteInfo.siteUrl || 'https://afina.vip';
  const seo = siteInfo.seo || {};
  const title = seo.title || 'AFINA VPN';
  const description = seo.description || 'VPN-сервис на протоколе VLESS.';
  const ogImage = seo.ogImage?.startsWith('http') ? seo.ogImage : `${siteUrl}${seo.ogImage || '/logo.png'}`;
  const iconUrl = siteInfo.logoUrl?.startsWith('http') ? siteInfo.logoUrl : (siteInfo.logoUrl || '/logo.png');

  return {
    title,
    description,
    keywords: seo.keywords,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: siteUrl, languages: { 'ru': '/' } },
    icons: { icon: iconUrl, apple: iconUrl },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: siteUrl,
      siteName: siteInfo.brand?.name || 'AFINA VPN',
      title,
      description,
      images: [{ url: ogImage, width: 512, height: 512, alt: title }],
    },
    twitter: { card: 'summary', title, description },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteInfo = await getSiteInfo();
  const theme = siteInfo.theme || { primaryColor: '#14b8a6', accentColor: '#f59e0b', bgColor: '#0f172a', textColor: '#e2e8f0', cardBg: '#1e293b', headingColor: '#fbbf24' };
  return (
    <html lang="ru" data-theme>
      <head>
        <ThemeStyles primaryColor={theme.primaryColor} accentColor={theme.accentColor} bgColor={theme.bgColor} textColor={theme.textColor} cardBg={theme.cardBg} headingColor={theme.headingColor} />
      </head>
      <body className={`${inter.variable} antialiased`} style={{ ['--theme-primary' as string]: theme.primaryColor, ['--theme-accent' as string]: theme.accentColor }}>
        <Header siteInfo={siteInfo} />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer siteInfo={siteInfo} />
      </body>
    </html>
  );
}

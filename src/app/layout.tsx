import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeStyles } from "@/components/ThemeStyles";
import { getSiteInfo } from "@/lib/data";

// Шапка и меню берутся из data/site-info.json; без force-dynamic они кэшируются и изменения из админки не применяются
export const dynamic = 'force-dynamic';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();
  const siteUrl = siteInfo.siteUrl || 'https://afina.vip';
  const seo = siteInfo.seo || {};
  const title = seo.title || siteInfo.brand?.name || 'AFINA VPN';
  const description = seo.description || 'VPN-сервис на протоколе VLESS.';
  const siteName = (siteInfo.brand?.name || 'AFINA VPN').trim();
  const base = siteUrl.replace(/\/$/, '');
  const ogImagePath = seo.ogImage || siteInfo.logoUrl || '/logo.png';
  const ogImage = ogImagePath.startsWith('http') ? ogImagePath : `${base}${ogImagePath.startsWith('/') ? '' : '/'}${ogImagePath.replace(/^\//, '')}`;
  const iconPath = siteInfo.logoUrl || '/logo.png';
  const iconUrl = iconPath.startsWith('http') ? iconPath : `${base}${iconPath.startsWith('/') ? '' : '/'}${iconPath.replace(/^\//, '')}`;

  return {
    title: { default: title, template: `%s | ${siteName}` },
    description,
    keywords: seo.keywords,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: siteUrl, languages: { 'ru': '/' } },
    icons: { icon: iconUrl, apple: iconUrl },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: siteUrl,
      siteName,
      title,
      description,
      images: [{ url: ogImage, width: 512, height: 512, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const siteInfo = await getSiteInfo();
  const theme = siteInfo.theme || { primaryColor: '#14b8a6', accentColor: '#f59e0b', bgColor: '#0f172a', textColor: '#e2e8f0', cardBg: '#1e293b', headingColor: '#fbbf24' };
  const siteUrl = siteInfo.siteUrl || 'https://afina.vip';
  const seo = siteInfo.seo || {};
  const title = seo.title || siteInfo.brand?.name || 'AFINA VPN';
  const description = seo.description || 'VPN-сервис на протоколе VLESS.';
  const siteName = (siteInfo.brand?.name || 'AFINA VPN').trim();
  const base = siteUrl.replace(/\/$/, '');
  const ogImagePath = seo.ogImage || siteInfo.logoUrl || '/logo.png';
  const ogImage = ogImagePath.startsWith('http') ? ogImagePath : `${base}${ogImagePath.startsWith('/') ? '' : '/'}${ogImagePath.replace(/^\//, '')}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    description,
    url: siteUrl,
    potentialAction: { '@type': 'SearchAction', target: siteUrl, 'query-input': 'required name=search_term_string' },
  };
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: ogImage,
    description,
  };

  return (
    <html lang="ru" data-theme>
      <head>
        <ThemeStyles primaryColor={theme.primaryColor} accentColor={theme.accentColor} bgColor={theme.bgColor} textColor={theme.textColor} cardBg={theme.cardBg} headingColor={theme.headingColor} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
      </head>
      <body className={`${inter.variable} antialiased`} style={{ ['--theme-primary' as string]: theme.primaryColor, ['--theme-accent' as string]: theme.accentColor }}>
        <Header siteInfo={siteInfo} />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer siteInfo={siteInfo} />
      </body>
    </html>
  );
}

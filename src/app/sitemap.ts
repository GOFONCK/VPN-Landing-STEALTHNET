import { MetadataRoute } from 'next';
import { getSiteInfo } from '@/lib/data';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteInfo = await getSiteInfo();
  const baseUrl = siteInfo.siteUrl || 'https://afina.vip';

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/#tariffs`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/instructions`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/contacts`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/offerta`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${baseUrl}/agreement`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
  ];
}

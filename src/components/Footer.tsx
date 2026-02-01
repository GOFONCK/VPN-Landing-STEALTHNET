import Link from 'next/link';
import Image from 'next/image';
import type { SiteInfo } from '@/lib/data';

interface FooterProps {
  siteInfo: SiteInfo;
}

export function Footer({ siteInfo }: FooterProps) {
  const brand = siteInfo.brand || { name: 'AFINA', tagline: 'VPN' };
  const logoUrl = siteInfo.logoUrl || '/logo.png';
  const copyright = siteInfo.footer?.copyright || `© ${new Date().getFullYear()} AFINA VPN`;
  return (
    <footer className="border-t border-teal-500/20 bg-slate-900/80">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            {logoUrl && <Image src={logoUrl} alt={brand.name} width={32} height={32} sizes="32px" className="rounded" />}
            <span className="font-medium text-amber-400">{brand.name}</span>
            <span className="text-slate-500">{brand.tagline}</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/instructions" className="text-slate-400 transition hover:text-amber-400">
              Инструкции
            </Link>
            <Link href="/offerta" className="text-slate-400 transition hover:text-amber-400">
              Оферта
            </Link>
            <Link href="/agreement" className="text-slate-400 transition hover:text-amber-400">
              Соглашение
            </Link>
            <Link href="/contacts" className="text-slate-400 transition hover:text-amber-400">
              Контакты
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {copyright}
        </p>
      </div>
    </footer>
  );
}

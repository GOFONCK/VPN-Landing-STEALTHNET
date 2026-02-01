'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SiteInfo } from '@/lib/data';

interface HeaderProps {
  siteInfo: SiteInfo;
}

export function Header({ siteInfo }: HeaderProps) {
  const authUrl = siteInfo.authUrl || '#';
  const registerUrl = siteInfo.registerUrl || '#';
  const brand = siteInfo.brand || { name: 'AFINA', tagline: 'VPN' };
  const logoUrl = siteInfo.logoUrl || '/logo.png';
  const theme = siteInfo.theme || {};
  const headerConfig = siteInfo.header || {
    showLogo: true,
    showBrand: true,
    elementOrder: ['logo', 'brand', 'nav', 'auth'],
    navItems: [
      { label: 'Тарифы', href: '/#tariffs' },
      { label: 'Инструкции', href: '/instructions' },
      { label: 'Оферта', href: '/offerta' },
      { label: 'Соглашение', href: '/agreement' },
      { label: 'Контакты', href: '/contacts' },
    ],
  };

  const primary = theme.primaryColor || '#14b8a6';
  const accent = theme.accentColor || '#f59e0b';
  const headerBg = theme.headerBg || 'rgba(2,6,23,0.98)';
  const textMuted = theme.textColor || '#94a3b8';

  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = headerConfig.navItems.map((item) =>
    item.href.startsWith('http') ? (
      <a key={item.href} href={item.href} className="transition" style={{ color: textMuted }} onMouseEnter={(e) => { e.currentTarget.style.color = accent; }} onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }} onClick={() => setMenuOpen(false)}>{item.label}</a>
    ) : (
      <Link key={item.href} href={item.href} className="transition" style={{ color: textMuted }} onMouseEnter={(e) => { e.currentTarget.style.color = accent; }} onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }} onClick={() => setMenuOpen(false)}>{item.label}</Link>
    )
  );

  const nav = <>{navLinks}</>;

  const elements: Record<string, React.ReactNode> = {
    logo: headerConfig.showLogo && logoUrl ? (
      <Image key="logo" src={logoUrl} alt={brand.name} width={40} height={40} className="rounded-lg shrink-0" />
    ) : null,
    brand: headerConfig.showBrand ? (
      <span key="brand" className="text-xl font-semibold tracking-tight">
        <span style={{ background: `linear-gradient(to right, ${accent}, #fcd34d)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{brand.name}</span>
        <span className="ml-1.5" style={{ color: textMuted }}>{brand.tagline}</span>
      </span>
    ) : null,
    nav: (
      <nav key="nav" className="hidden items-center gap-8 md:flex">
        {nav}
      </nav>
    ),
    auth: (
      <div key="auth" className="ml-4 flex items-center gap-3 border-l pl-6" style={{ borderColor: `${primary}40` }}>
        <a href={authUrl} className="text-sm transition" style={{ color: textMuted }} onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; }} onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}>Авторизация</a>
        <a href={registerUrl} className="rounded-lg px-4 py-2 text-sm font-medium transition" style={{ backgroundColor: `${accent}e6`, color: '#0f172a' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${accent}e6`; }}>Регистрация</a>
      </div>
    ),
  };

  const order = headerConfig.elementOrder || ['logo', 'brand', 'nav', 'auth'];
  const leftElements = order.filter((id) => ['logo', 'brand'].includes(id)).map((id) => elements[id]).filter(Boolean);
  const rightElements = order.filter((id) => ['nav', 'auth'].includes(id)).map((id) => elements[id]).filter(Boolean);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: headerBg, borderColor: `${primary}30` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {leftElements}
        </Link>
        <div className="hidden md:flex md:items-center md:gap-4">
          {rightElements}
        </div>
        <button className="p-2 md:hidden transition" style={{ color: textMuted }} onMouseEnter={(e) => { e.currentTarget.style.color = accent; }} onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="border-t px-4 py-4 md:hidden" style={{ borderColor: `${primary}30`, backgroundColor: headerBg }}>
          <nav className="flex flex-col gap-4">{nav}</nav>
          <div className="mt-4 flex gap-3 border-t pt-4" style={{ borderColor: `${primary}30` }}>
            <a href={authUrl} className="flex-1 rounded-lg border py-2.5 text-center text-sm" style={{ borderColor: `${primary}50`, color: textMuted }}>Авторизация</a>
            <a href={registerUrl} className="flex-1 rounded-lg py-2.5 text-center text-sm font-medium" style={{ backgroundColor: accent, color: '#0f172a' }}>Регистрация</a>
          </div>
        </div>
      )}
    </header>
  );
}

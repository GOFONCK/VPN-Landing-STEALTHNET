import Image from 'next/image';
import Link from 'next/link';
import { getTariffs, getSiteInfo } from '@/lib/data';
import { TariffCard } from '@/components/TariffCard';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

export default async function HomePage() {
  const [tariffs, siteInfo] = await Promise.all([getTariffs(), getSiteInfo()]);
  const connectUrl = siteInfo.connectUrl || '#tariffs';
  const faq = siteInfo.faq || [];
  const trustFacts = siteInfo.trustFacts || [];
  const blocks = siteInfo.blocks || { hero: true, trustFacts: true, features: true, tariffs: true, faq: true };
  const hero = siteInfo.hero || { title: 'AFINA', subtitle: '', buttonText: 'Подключиться' };
  const brand = siteInfo.brand || { name: 'AFINA', tagline: 'VPN' };
  const logoUrl = siteInfo.logoUrl || '/logo.png';
  const featuresBlock = siteInfo.featuresBlock || { title: 'Почему AFINA VPN', items: [] };
  const tariffsBlock = siteInfo.tariffsBlock || { title: 'Тарифные планы', subtitle: '' };
  const defaultFeatures = [
    { title: 'Протокол VLESS', description: 'Современный протокол для стабильного и быстрого подключения.' },
    { title: 'Скорость и стабильность', description: 'Оптимизированная инфраструктура обеспечивает высокую скорость.' },
    { title: 'Конфиденциальность', description: 'Строгая политика в отношении данных.' },
  ];
  const features = featuresBlock.items?.length > 0 ? featuresBlock.items : defaultFeatures;
  const blockOrder = siteInfo.blockOrder || ['hero', 'trustFacts', 'features', 'tariffs', 'faq'];
  const design = siteInfo.design || {};
  const heroOrder = design.heroElementOrder || ['logo', 'title', 'subtitle', 'button'];
  const titleSize = design.heroTitleSize || 'text-5xl md:text-6xl lg:text-7xl';
  const subtitleSize = design.heroSubtitleSize || 'text-lg md:text-xl';
  const sectionPad = design.sectionPadding || 'py-16 md:py-20';
  const cardRadius = design.cardRadius || 'rounded-xl';
  const buttonRadius = design.buttonRadius || 'rounded-full';

  const heroElements: Record<string, React.ReactNode> = {
    logo: logoUrl ? <Image key="logo" src={logoUrl} alt={brand.name} width={140} height={140} sizes="140px" className="mx-auto rounded-2xl shadow-xl shadow-teal-500/20" priority /> : null,
    title: <h1 key="title" className={`mt-6 font-semibold tracking-tight ${titleSize}`}><span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 bg-clip-text text-transparent">{hero.title || brand.name}</span><span className="ml-2 text-slate-500">{brand.tagline}</span></h1>,
    subtitle: hero.subtitle ? <p key="subtitle" className={`mt-6 leading-relaxed text-slate-400 ${subtitleSize}`}>{hero.subtitle}</p> : null,
    button: <Link key="button" href={connectUrl} className={`mt-10 inline-flex items-center gap-2 border border-amber-500/50 bg-amber-500/10 px-8 py-3.5 font-medium text-amber-400 transition hover:border-amber-400/70 hover:bg-amber-500/20 ${buttonRadius}`}><span>{hero.buttonText || 'Подключиться'}</span><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></Link>,
  };

  const blockComponents: Record<string, React.ReactNode> = {
    hero: blocks.hero !== false ? (
      <section key="hero" className="relative overflow-hidden px-4 py-32 md:py-44">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <AnimateOnScroll>
            <div className="flex flex-col items-center">
              {heroOrder.map((id) => heroElements[id]).filter(Boolean)}
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    ) : null,
    trustFacts: blocks.trustFacts !== false && trustFacts.length > 0 ? (
      <section key="trustFacts" className={`border-y border-teal-500/10 bg-slate-900/20 px-4 ${sectionPad}`}>
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {trustFacts.map((f, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-amber-400">{f.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{f.title}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    ) : null,
    features: blocks.features !== false ? (
      <section key="features" className={`border-y border-teal-500/10 bg-slate-900/30 px-4 ${sectionPad}`}>
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll><h2 className="text-center text-2xl font-semibold text-slate-100 md:text-3xl">{featuresBlock.title}</h2></AnimateOnScroll>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <AnimateOnScroll key={i} delay={i * 100}>
                <div className={`${cardRadius} border border-teal-500/20 bg-slate-800/50 p-6`}>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/20">
                    <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">{f.title}</h3>
                  <p className="mt-2 text-slate-400">{f.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    tariffs: blocks.tariffs !== false ? (
      <section key="tariffs" id="tariffs" className={`scroll-mt-24 px-4 ${sectionPad}`}>
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <h2 className="text-center text-2xl font-semibold text-slate-100 md:text-3xl">{tariffsBlock.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">{tariffsBlock.subtitle}</p>
          </AnimateOnScroll>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tariffs.map((tariff, i) => (
              <AnimateOnScroll key={tariff.id} delay={i * 80} className="h-full">
                <TariffCard tariff={tariff} cardRadius={cardRadius} buttonRadius={buttonRadius} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    faq: blocks.faq !== false && faq.length > 0 ? (
      <section key="faq" id="faq" className={`scroll-mt-24 border-y border-teal-500/10 bg-slate-900/20 px-4 ${sectionPad}`}>
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll><h2 className="text-center text-2xl font-semibold text-slate-100 md:text-3xl">Частые вопросы</h2></AnimateOnScroll>
          <div className="mt-12 space-y-6">
            {faq.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 60}>
                <details className={`group ${cardRadius} border border-teal-500/20 bg-slate-800/50 p-4`}>
                  <summary className="cursor-pointer font-medium text-slate-200">{item.question}</summary>
                  <p className="mt-3 text-slate-400">{item.answer}</p>
                </details>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    ) : null,
  };

  return (
    <div className="bg-circuit">
      {blockOrder.map((id) => blockComponents[id]).filter(Boolean)}
    </div>
  );
}

import { getSiteInfo } from '@/lib/data';

export const metadata = {
  title: 'Оферта — AFINA VPN',
  description: 'Публичная оферта AFINA VPN',
};

export default async function OffertaPage() {
  const info = await getSiteInfo();
  const text = info.offerta;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-100">Публичная оферта</h1>
      <div className="mt-8 whitespace-pre-wrap text-slate-300 leading-relaxed">
        {text}
      </div>
    </article>
  );
}

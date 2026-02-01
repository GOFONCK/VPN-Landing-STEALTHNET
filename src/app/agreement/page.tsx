import { getSiteInfo } from '@/lib/data';

export const metadata = {
  title: 'Соглашение — AFINA VPN',
  description: 'Соглашение о конфиденциальности и использовании AFINA VPN',
};

export default async function AgreementPage() {
  const info = await getSiteInfo();
  const text = info.agreement;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-100">Соглашение</h1>
      <p className="mt-2 text-slate-500">О конфиденциальности и использовании сервиса</p>
      <div className="mt-8 whitespace-pre-wrap text-slate-300 leading-relaxed">
        {text}
      </div>
    </article>
  );
}

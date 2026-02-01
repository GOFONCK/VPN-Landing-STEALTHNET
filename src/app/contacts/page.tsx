import { getSiteInfo } from '@/lib/data';
import Image from 'next/image';

export const metadata = {
  title: 'Контакты — AFINA VPN',
  description: 'Свяжитесь с нами — AFINA VPN',
};

export default async function ContactsPage() {
  const info = await getSiteInfo();
  const { email, telegram } = info.contacts;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-100">Контакты</h1>
      <p className="mt-4 text-slate-400">
        По вопросам подключения, тарифов и технической поддержки свяжитесь с нами.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-4 rounded-xl border border-teal-500/20 bg-slate-800/50 p-6 transition hover:border-teal-500/50 hover:bg-slate-800/80"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/20">
            <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-100">Email</p>
            <p className="text-teal-400">{email}</p>
          </div>
        </a>
        <a
          href={`https://t.me/${telegram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border border-teal-500/20 bg-slate-800/50 p-6 transition hover:border-teal-500/50 hover:bg-slate-800/80"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/20">
            <svg className="h-6 w-6 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-100">Telegram</p>
            <p className="text-teal-400">{telegram}</p>
          </div>
        </a>
      </div>
      <div className="mt-16 flex flex-col items-center gap-6 rounded-xl border border-teal-500/20 bg-slate-800/30 p-8 text-center">
        <Image src="/logo.png" alt="AFINA VPN" width={80} height={80} className="rounded-xl" />
        <p className="text-slate-400">
          Напишите нам для получения инструкций по подключению и выбора тарифного плана.
        </p>
      </div>
    </div>
  );
}

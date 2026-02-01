import { getSiteInfo } from '@/lib/data';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

export const metadata = {
  title: 'Как подключиться — AFINA VPN',
  description: 'Пошаговая инструкция по подключению к AFINA VPN.',
};

function formatInstructions(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-2xl font-bold text-slate-100 md:text-3xl">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="mt-8 text-xl font-semibold text-amber-400">{line.slice(3)}</h2>);
    } else if (line.trim()) {
      elements.push(<p key={key++} className="mt-2 text-slate-400 leading-relaxed">{line}</p>);
    }
  }
  return elements;
}

export default async function InstructionsPage() {
  const siteInfo = await getSiteInfo();
  const content = siteInfo.instructions || 'Инструкция в процессе подготовки.';

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <AnimateOnScroll>
        <h1 className="text-3xl font-bold text-slate-100">Как подключиться</h1>
        <p className="mt-2 text-slate-500">Пошаговое руководство по настройке</p>
      </AnimateOnScroll>
      <div className="mt-10 space-y-2">
        {formatInstructions(content).map((el, i) => (
          <AnimateOnScroll key={i} delay={i * 50}>{el}</AnimateOnScroll>
        ))}
      </div>
    </article>
  );
}

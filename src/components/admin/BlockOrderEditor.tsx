'use client';

const BLOCK_LABELS: Record<string, string> = {
  hero: 'Hero (верхний блок)',
  trustFacts: 'Факты доверия',
  features: 'Преимущества',
  tariffs: 'Тарифы',
  faq: 'FAQ',
};

interface BlockOrderEditorProps {
  order: string[];
  blocks: Record<string, boolean>;
  onChange: (order: string[], blocks: Record<string, boolean>) => void;
}

export function BlockOrderEditor({ order, blocks, onChange }: BlockOrderEditorProps) {
  const move = (index: number, dir: number) => {
    const newOrder = [...order];
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    onChange(newOrder, blocks);
  };

  const toggle = (id: string) => {
    onChange(order, { ...blocks, [id]: !blocks[id] });
  };

  return (
    <div className="space-y-2">
      {order.map((id, i) => (
        <div
          key={id}
          className="flex items-center gap-3 rounded-lg border border-teal-500/20 bg-slate-800/50 p-3"
        >
          <div className="flex flex-col gap-0.5">
            <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-slate-400 hover:text-teal-400 disabled:opacity-30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="p-1 text-slate-400 hover:text-teal-400 disabled:opacity-30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <span className="flex-1 text-slate-200">{BLOCK_LABELS[id] || id}</span>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={blocks[id] !== false} onChange={() => toggle(id)} />
            <span className="text-sm text-slate-500">Показать</span>
          </label>
        </div>
      ))}
    </div>
  );
}

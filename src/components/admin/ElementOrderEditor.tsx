'use client';

interface ElementOrderEditorProps {
  order: string[];
  labels: Record<string, string>;
  onChange: (order: string[]) => void;
}

export function ElementOrderEditor({ order, labels, onChange }: ElementOrderEditorProps) {
  const move = (index: number, dir: number) => {
    const newOrder = [...order];
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    onChange(newOrder);
  };

  return (
    <div className="space-y-2">
      {order.map((id, i) => (
        <div key={id} className="flex items-center gap-3 rounded-lg border border-teal-500/20 bg-slate-800/50 p-3">
          <div className="flex flex-col gap-0.5">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-slate-400 hover:text-teal-400 disabled:opacity-30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1} className="p-1 text-slate-400 hover:text-teal-400 disabled:opacity-30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <span className="text-slate-200">{labels[id] || id}</span>
        </div>
      ))}
    </div>
  );
}

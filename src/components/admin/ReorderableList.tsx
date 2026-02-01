'use client';

interface ReorderableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, onChange: (item: T) => void) => React.ReactNode;
  onAdd: () => T;
  emptyLabel?: string;
}

export function ReorderableList<T>({
  items,
  onChange,
  renderItem,
  onAdd,
  emptyLabel = 'Элементы отсутствуют',
}: ReorderableListProps<T>) {
  const move = (index: number, dir: number) => {
    const newItems = [...items];
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    onChange(newItems);
  };

  const update = (index: number, item: T) => {
    const newItems = [...items];
    newItems[index] = item;
    onChange(newItems);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        items.map((item, i) => (
          <div
            key={i}
            className="flex gap-2 rounded-lg border border-teal-500/20 bg-slate-800/50 p-3"
          >
            <div className="flex flex-col gap-0.5 shrink-0">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-slate-400 hover:text-teal-400 disabled:opacity-30">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 text-slate-400 hover:text-teal-400 disabled:opacity-30">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button type="button" onClick={() => remove(i)} className="p-1 text-slate-400 hover:text-red-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            <div className="flex-1 min-w-0">
              {renderItem(item, i, (updated) => update(i, updated))}
            </div>
          </div>
        ))
      )}
      <button type="button" onClick={() => onChange([...items, onAdd()])} className="rounded-lg border border-dashed border-teal-500/50 px-4 py-2 text-sm text-teal-400 hover:bg-teal-500/10">
        + Добавить
      </button>
    </div>
  );
}

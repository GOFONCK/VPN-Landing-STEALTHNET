'use client';

interface Theme {
  primaryColor?: string;
  accentColor?: string;
  bgColor?: string;
  textColor?: string;
  cardBg?: string;
  headingColor?: string;
}

interface ThemePreviewProps {
  theme: Theme;
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  const primary = theme.primaryColor ?? '#14b8a6';
  const accent = theme.accentColor ?? '#f59e0b';
  const bg = theme.bgColor ?? '#0f172a';
  const text = theme.textColor ?? '#e2e8f0';
  const cardBg = theme.cardBg ?? '#1e293b';
  const heading = theme.headingColor ?? '#fbbf24';

  return (
    <div
      className="rounded-xl border border-teal-500/20 p-4"
      style={{ background: `linear-gradient(180deg, ${bg} 0%, #0c1222 50%, #0a0f1a 100%)` }}
    >
      <p className="mb-3 text-xs font-medium text-slate-500">Превью — изменения видны сразу</p>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: cardBg }}>
            <div className="h-8 w-8 rounded" style={{ backgroundColor: primary }} title="Основной" />
            <span className="text-sm" style={{ color: text }}>Основной</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: cardBg }}>
            <div className="h-8 w-8 rounded" style={{ backgroundColor: accent }} title="Акцент" />
            <span className="text-sm" style={{ color: text }}>Акцент</span>
          </div>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            backgroundColor: cardBg,
            borderColor: `${primary}40`,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: heading }}>Заголовок карточки</p>
          <p className="mt-1 text-xs" style={{ color: text }}>Пример текста карточки. Цвета обновляются в реальном времени.</p>
          <button
            type="button"
            className="mt-3 rounded-full px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: `${accent}20`,
              border: `1px solid ${accent}80`,
              color: accent,
            }}
          >
            Подключиться
          </button>
        </div>
      </div>
    </div>
  );
}

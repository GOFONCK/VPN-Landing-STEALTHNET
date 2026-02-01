'use client';

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-xl font-bold text-slate-100">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="mt-4 text-lg font-semibold text-amber-400">{line.slice(3)}</h2>);
    } else if (line.trim()) {
      elements.push(<p key={key++} className="text-slate-400">{line}</p>);
    } else {
      elements.push(<br key={key++} />);
    }
  }
  return elements;
}

interface MarkdownPreviewProps {
  text: string;
  className?: string;
}

export function MarkdownPreview({ text, className = '' }: MarkdownPreviewProps) {
  return (
    <div className={`rounded-lg border border-teal-500/20 bg-slate-900/50 p-4 ${className}`}>
      <p className="mb-2 text-xs font-medium text-slate-500">Предпросмотр:</p>
      <div className="prose prose-invert max-w-none text-sm">
        {text ? renderMarkdown(text) : <span className="text-slate-600">Пусто</span>}
      </div>
    </div>
  );
}

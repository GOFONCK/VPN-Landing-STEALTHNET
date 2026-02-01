'use client';

import { useState } from 'react';

interface PreviewPanelProps {
  previewKey?: number; // меняется при сохранении для refresh
}

export function PreviewPanel({ previewKey = 0 }: PreviewPanelProps) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(previewKey);

  const refresh = () => setKey((k) => k + 1);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-amber-500 px-4 py-3 font-medium text-slate-900 shadow-lg hover:bg-amber-400"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {open ? 'Скрыть' : 'Предпросмотр'}
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-2">
            <span className="text-sm font-medium text-slate-300">Предпросмотр сайта</span>
            <div className="flex gap-2">
              <button onClick={refresh} className="rounded bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-500">
                Обновить
              </button>
              <a href="/" target="_blank" rel="noopener" className="rounded border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800">
                Открыть в новой вкладке
              </a>
            </div>
          </div>
          <iframe
            key={key}
            src="/"
            className="flex-1 w-full border-0"
            title="Предпросмотр"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      )}
    </>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Tariff, SiteInfo } from '@/lib/data';
import { CURRENCY_SYMBOLS } from '@/lib/constants';
import { PreviewPanel } from '@/components/admin/PreviewPanel';
import { BlockOrderEditor } from '@/components/admin/BlockOrderEditor';
import { MarkdownPreview } from '@/components/admin/MarkdownPreview';
import { ReorderableList } from '@/components/admin/ReorderableList';
import { ElementOrderEditor } from '@/components/admin/ElementOrderEditor';
import { ThemePreview } from '@/components/admin/ThemePreview';
import { DEFAULT_THEME } from '@/lib/constants';

export default function AdminPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    const ok = sessionStorage.getItem('admin_auth');
    if (ok === '1') {
      setAuth(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    const [tRes, iRes] = await Promise.all([fetch('/api/tariffs'), fetch('/api/site-info')]);
    const t = await tRes.json();
    const i = await iRes.json();
    setTariffs(t);
    setSiteInfo(i);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      sessionStorage.setItem('admin_auth', '1');
      setAuth(true);
      loadData();
    } else {
      setError(data.error || 'Неверный пароль');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuth(false);
    router.push('/');
  };

  const handleAddTariff = () => {
    const newTariff: Tariff = {
      id: crypto.randomUUID(),
      name: 'Новый тариф',
      price: 0,
      currency: 'RUB',
      period: '1 месяц',
      features: [],
      sortOrder: tariffs.length + 1,
      buttonUrl: '',
    };
    setTariffs([...tariffs, newTariff]);
    setEditing(newTariff.id);
  };

  const handleSaveTariff = async (tariff: Tariff) => {
    setSaving(true);
    const exists = tariffs.find((t) => t.id === tariff.id);
    if (exists) {
      await fetch(`/api/tariffs/${tariff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tariff),
      });
    } else {
      await fetch('/api/tariffs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tariff),
      });
    }
    await loadData();
    setEditing(null);
    setSaving(false);
  };

  const handleDeleteTariff = async (id: string) => {
    if (!confirm('Удалить этот тариф?')) return;
    await fetch(`/api/tariffs/${id}`, { method: 'DELETE' });
    await loadData();
    setEditing(null);
  };

  const handleSaveSiteInfo = async (info: SiteInfo) => {
    setSaving(true);
    setSaveError('');
    const res = await fetch('/api/site-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSaveError(data.error || `Ошибка сохранения: ${res.status}`);
      setSaving(false);
      return;
    }
    await loadData();
    setPreviewKey((k) => k + 1);
    setSaving(false);
  };

  if (!auth) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-xl border border-teal-500/20 bg-slate-800/80 p-8">
          <h1 className="text-xl font-semibold text-slate-100">Вход в панель управления</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="mt-4 w-full rounded-lg border border-teal-500/30 bg-slate-900 px-4 py-2 text-slate-100 placeholder-slate-500"
            required
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          <button type="submit" className="mt-6 w-full rounded-lg bg-amber-500 py-2 font-medium text-slate-900 hover:bg-amber-400">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <PreviewPanel previewKey={previewKey} />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Панель управления</h1>
        <button onClick={handleLogout} className="rounded-lg border border-slate-600 px-4 py-2 text-slate-400 hover:text-slate-200">
          Выйти
        </button>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-slate-200">Тарифы</h2>
        <button onClick={handleAddTariff} className="mb-4 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-500">
          + Добавить тариф
        </button>
        <div className="space-y-4">
          {tariffs.map((tariff) => (
            <div key={tariff.id} className="rounded-xl border border-teal-500/20 bg-slate-800/50 p-4">
              {editing === tariff.id ? (
                <TariffForm
                  tariff={tariff}
                  onSave={(t) => handleSaveTariff(t)}
                  onCancel={() => setEditing(null)}
                  onDelete={() => handleDeleteTariff(tariff.id)}
                  saving={saving}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">{tariff.name}</p>
                    <p className="text-sm text-slate-400">
                      {tariff.price} {CURRENCY_SYMBOLS[tariff.currency ?? 'RUB'] ?? tariff.currency ?? '₽'} / {tariff.period}
                    </p>
                  </div>
                  <button onClick={() => setEditing(tariff.id)} className="rounded-lg border border-teal-500/50 px-3 py-1 text-teal-400 hover:bg-teal-500/10">
                    Редактировать
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {siteInfo && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-200">Контакты и документы</h2>
          {saveError && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {saveError}
            </div>
          )}
          <SiteInfoForm info={siteInfo} onSave={handleSaveSiteInfo} saving={saving} />
        </section>
      )}
    </div>
  );
}

function TariffForm({
  tariff,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  tariff: Tariff;
  onSave: (t: Tariff) => void;
  onCancel: () => void;
  onDelete: () => void;
  saving: boolean;
}) {
  const [t, setT] = useState(tariff);
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400">Название</label>
        <input
          value={t.name}
          onChange={(e) => setT({ ...t, name: e.target.value })}
          className="mt-1 w-full rounded border border-teal-500/30 bg-slate-900 px-3 py-2 text-slate-100"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400">Цена</label>
          <input
            type="number"
            value={t.price}
            onChange={(e) => setT({ ...t, price: Number(e.target.value) })}
            className="mt-1 w-full rounded border border-teal-500/30 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400">Валюта</label>
          <select
            value={t.currency ?? 'RUB'}
            onChange={(e) => setT({ ...t, currency: e.target.value })}
            className="mt-1 w-full rounded border border-teal-500/30 bg-slate-900 px-3 py-2 text-slate-100"
          >
            {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
              <option key={code} value={code}>{code} ({symbol})</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-slate-400">Период</label>
          <select
            value={t.period}
            onChange={(e) => setT({ ...t, period: e.target.value })}
            className="mt-1 w-full rounded border border-teal-500/30 bg-slate-900 px-3 py-2 text-slate-100"
          >
            <optgroup label="Недели">
              <option>1 неделя</option>
              <option>2 недели</option>
              <option>3 недели</option>
              <option>4 недели</option>
            </optgroup>
            <optgroup label="Месяцы">
              <option>1 месяц</option>
              <option>2 месяца</option>
              <option>3 месяца</option>
              <option>4 месяца</option>
              <option>5 месяцев</option>
              <option>6 месяцев</option>
              <option>9 месяцев</option>
              <option>12 месяцев</option>
              <option>18 месяцев</option>
              <option>24 месяца</option>
              <option>36 месяцев</option>
            </optgroup>
            <optgroup label="Годы">
              <option>1 год</option>
              <option>2 года</option>
              <option>3 года</option>
              <option>5 лет</option>
            </optgroup>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-400">Преимущества (каждое с новой строки)</label>
        <textarea
          value={t.features.join('\n')}
          onChange={(e) => setT({ ...t, features: e.target.value.split('\n').filter(Boolean) })}
          rows={4}
          className="mt-1 w-full rounded border border-teal-500/30 bg-slate-900 px-3 py-2 text-slate-100"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400">Ссылка кнопки «Подключиться»</label>
        <input
          value={t.buttonUrl ?? ''}
          onChange={(e) => setT({ ...t, buttonUrl: e.target.value })}
          placeholder="https://..."
          className="mt-1 w-full rounded border border-teal-500/30 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-600"
        />
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={t.popular ?? false} onChange={(e) => setT({ ...t, popular: e.target.checked })} />
          <span className="text-sm text-slate-400">Популярный тариф</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(t)} disabled={saving} className="rounded-lg bg-amber-500 px-4 py-2 text-slate-900 hover:bg-amber-400 disabled:opacity-50">
          Сохранить
        </button>
        <button onClick={onCancel} className="rounded-lg border border-slate-600 px-4 py-2 text-slate-400">
          Отмена
        </button>
        <button onClick={onDelete} className="rounded-lg border border-red-500/50 px-4 py-2 text-red-400 hover:bg-red-500/10">
          Удалить
        </button>
      </div>
    </div>
  );
}

const ADMIN_TABS = ['Общее', 'Шапка', 'SEO', 'Оформление', 'Блоки', 'Контент', 'Дизайн', 'Документы'] as const;

function LogoUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) onUploaded(data.url);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };
  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={loading} className="rounded-lg border border-teal-500/50 px-4 py-2 text-sm text-teal-400 hover:bg-teal-500/10 disabled:opacity-50">
        {loading ? '...' : 'Загрузить'}
      </button>
    </>
  );
}

function SiteInfoForm({ info, onSave, saving }: { info: SiteInfo; onSave: (i: SiteInfo) => void; saving: boolean }) {
  const [i, setI] = useState(info);
  const [tab, setTab] = useState<(typeof ADMIN_TABS)[number]>('Общее');
  useEffect(() => {
    setI(info);
  }, [info]);
  const input = (cls: string) => `mt-1 w-full rounded border border-teal-500/30 bg-slate-900 px-3 py-2 text-slate-100 ${cls}`;

  return (
    <div className="rounded-xl border border-teal-500/20 bg-slate-800/50 overflow-hidden">
      <div className="flex border-b border-teal-500/20 overflow-x-auto">
        {ADMIN_TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${tab === t ? 'bg-teal-500/20 text-teal-400 border-b-2 border-teal-500' : 'text-slate-400 hover:text-slate-200'}`}>{t}</button>
        ))}
      </div>
      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
      {tab === 'Общее' && (
      <>
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">Логотип и бренд</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-400">URL логотипа</label>
            <div className="flex gap-2">
              <input value={i.logoUrl ?? ''} onChange={(e) => setI({ ...i, logoUrl: e.target.value })} placeholder="/logo.png" className={input('placeholder-slate-600 flex-1')} />
              <LogoUploader onUploaded={(url) => setI({ ...i, logoUrl: url })} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Или вставьте URL картинки. Для загрузки используйте кнопку.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400">Название бренда</label>
              <input value={i.brand?.name ?? ''} onChange={(e) => setI({ ...i, brand: { ...i.brand, name: e.target.value } })} placeholder="AFINA" className={input('placeholder-slate-600')} />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Подзаголовок</label>
              <input value={i.brand?.tagline ?? ''} onChange={(e) => setI({ ...i, brand: { ...i.brand, tagline: e.target.value } })} placeholder="VPN" className={input('placeholder-slate-600')} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">Ссылки кнопок в шапке</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-slate-400">Авторизация (URL)</label>
            <input value={i.authUrl ?? ''} onChange={(e) => setI({ ...i, authUrl: e.target.value })} placeholder="https://..." className={input('placeholder-slate-600')} />
          </div>
          <div>
            <label className="block text-sm text-slate-400">Регистрация (URL)</label>
            <input value={i.registerUrl ?? ''} onChange={(e) => setI({ ...i, registerUrl: e.target.value })} placeholder="https://..." className={input('placeholder-slate-600')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400">Подключиться (кнопка в hero, URL)</label>
            <input value={i.connectUrl ?? ''} onChange={(e) => setI({ ...i, connectUrl: e.target.value })} placeholder="#tariffs" className={input('placeholder-slate-600')} />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-400">Базовый URL сайта</label>
        <input value={i.siteUrl ?? ''} onChange={(e) => setI({ ...i, siteUrl: e.target.value })} placeholder="https://afina.vip" className={input('placeholder-slate-600')} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">Контакты</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm text-slate-400">Email</label>
            <input value={i.contacts?.email ?? ''} onChange={(e) => setI({ ...i, contacts: { ...i.contacts, email: e.target.value } })} className={input('')} />
          </div>
          <div>
            <label className="block text-sm text-slate-400">Telegram</label>
            <input value={i.contacts?.telegram ?? ''} onChange={(e) => setI({ ...i, contacts: { ...i.contacts, telegram: e.target.value } })} placeholder="@username" className={input('placeholder-slate-600')} />
          </div>
        </div>
      </div>
      </>
      )}
      {tab === 'Шапка' && (
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-300">Видимость</h3>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={i.header?.showLogo !== false} onChange={(e) => setI({ ...i, header: { ...i.header, showLogo: e.target.checked } })} />
            <span className="text-slate-300">Показывать логотип</span>
          </label>
          <label className="mt-2 flex items-center gap-2">
            <input type="checkbox" checked={i.header?.showBrand !== false} onChange={(e) => setI({ ...i, header: { ...i.header, showBrand: e.target.checked } })} />
            <span className="text-slate-300">Показывать название бренда</span>
          </label>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Порядок элементов (стрелками вверх/вниз)</label>
          <ElementOrderEditor
            order={i.header?.elementOrder || ['logo', 'brand', 'nav', 'auth']}
            labels={{ logo: 'Логотип', brand: 'Название', nav: 'Меню', auth: 'Авторизация/Регистрация' }}
            onChange={(order) => setI({ ...i, header: { ...i.header, elementOrder: order } })}
          />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-300">Пункты меню</h3>
          <p className="mb-2 text-xs text-slate-500">Порядок, добавление и удаление пунктов</p>
          <ReorderableList
            items={i.header?.navItems ?? [{ label: 'Тарифы', href: '/#tariffs' }, { label: 'Инструкции', href: '/instructions' }, { label: 'Оферта', href: '/offerta' }, { label: 'Соглашение', href: '/agreement' }, { label: 'Контакты', href: '/contacts' }]}
            onChange={(items) => setI({ ...i, header: { ...i.header, navItems: items } })}
            onAdd={() => ({ label: '', href: '/' })}
            renderItem={(item, _, updateItem) => (
              <div className="grid gap-2 grid-cols-2">
                <input value={item.label} onChange={(e) => updateItem({ ...item, label: e.target.value })} placeholder="Текст" className={input('placeholder-slate-600 text-sm')} />
                <input value={item.href} onChange={(e) => updateItem({ ...item, href: e.target.value })} placeholder="/путь или URL" className={input('placeholder-slate-600 text-sm')} />
              </div>
            )}
            emptyLabel="Добавьте пункты меню"
          />
        </div>
      </div>
      )}
      {tab === 'SEO' && (
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400">Заголовок страницы</label>
          <input value={i.seo?.title ?? ''} onChange={(e) => setI({ ...i, seo: { ...i.seo, title: e.target.value } })} placeholder="AFINA VPN — Защищённое подключение" className={input('placeholder-slate-600')} />
        </div>
        <div>
          <label className="block text-sm text-slate-400">Описание (meta description)</label>
          <textarea value={i.seo?.description ?? ''} onChange={(e) => setI({ ...i, seo: { ...i.seo, description: e.target.value } })} rows={2} className={input('placeholder-slate-600')} />
        </div>
        <div>
          <label className="block text-sm text-slate-400">Ключевые слова</label>
          <input value={i.seo?.keywords ?? ''} onChange={(e) => setI({ ...i, seo: { ...i.seo, keywords: e.target.value } })} placeholder="VPN, VLESS, защита" className={input('placeholder-slate-600')} />
        </div>
        <div>
          <label className="block text-sm text-slate-400">OG-изображение (URL для соцсетей)</label>
          <input value={i.seo?.ogImage ?? ''} onChange={(e) => setI({ ...i, seo: { ...i.seo, ogImage: e.target.value } })} placeholder="/logo.png" className={input('placeholder-slate-600')} />
        </div>
      </div>
      )}
      {tab === 'Оформление' && (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Цвета применяются на сайте после сохранения. Превью ниже обновляется сразу.</p>
          <button type="button" onClick={() => setI({ ...i, theme: { ...DEFAULT_THEME } })} className="rounded-lg border border-slate-500/50 px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-200">
            Сбросить на стандарт
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400">Основной (границы, иконки)</label>
              <div className="flex gap-2">
                <input type="color" value={i.theme?.primaryColor ?? DEFAULT_THEME.primaryColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, primaryColor: e.target.value } })} className="h-10 w-14 shrink-0 rounded cursor-pointer border-0 bg-transparent" />
                <input value={i.theme?.primaryColor ?? DEFAULT_THEME.primaryColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, primaryColor: e.target.value } })} className={input('flex-1 font-mono text-sm')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Акцент (кнопки, выделения)</label>
              <div className="flex gap-2">
                <input type="color" value={i.theme?.accentColor ?? DEFAULT_THEME.accentColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, accentColor: e.target.value } })} className="h-10 w-14 shrink-0 rounded cursor-pointer border-0 bg-transparent" />
                <input value={i.theme?.accentColor ?? DEFAULT_THEME.accentColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, accentColor: e.target.value } })} className={input('flex-1 font-mono text-sm')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Фон страницы</label>
              <div className="flex gap-2">
                <input type="color" value={i.theme?.bgColor ?? DEFAULT_THEME.bgColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, bgColor: e.target.value } })} className="h-10 w-14 shrink-0 rounded cursor-pointer border-0 bg-transparent" />
                <input value={i.theme?.bgColor ?? DEFAULT_THEME.bgColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, bgColor: e.target.value } })} className={input('flex-1 font-mono text-sm')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Текст</label>
              <div className="flex gap-2">
                <input type="color" value={i.theme?.textColor ?? DEFAULT_THEME.textColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, textColor: e.target.value } })} className="h-10 w-14 shrink-0 rounded cursor-pointer border-0 bg-transparent" />
                <input value={i.theme?.textColor ?? DEFAULT_THEME.textColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, textColor: e.target.value } })} className={input('flex-1 font-mono text-sm')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Фон карточек</label>
              <div className="flex gap-2">
                <input type="color" value={i.theme?.cardBg ?? DEFAULT_THEME.cardBg} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, cardBg: e.target.value } })} className="h-10 w-14 shrink-0 rounded cursor-pointer border-0 bg-transparent" />
                <input value={i.theme?.cardBg ?? DEFAULT_THEME.cardBg} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, cardBg: e.target.value } })} className={input('flex-1 font-mono text-sm')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Заголовки и акценты</label>
              <div className="flex gap-2">
                <input type="color" value={i.theme?.headingColor ?? DEFAULT_THEME.headingColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, headingColor: e.target.value } })} className="h-10 w-14 shrink-0 rounded cursor-pointer border-0 bg-transparent" />
                <input value={i.theme?.headingColor ?? DEFAULT_THEME.headingColor} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, headingColor: e.target.value } })} className={input('flex-1 font-mono text-sm')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Фон шапки</label>
              <div className="flex gap-2">
                <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(i.theme?.headerBg ?? '') ? (i.theme?.headerBg ?? '#020617') : '#020617'} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, headerBg: e.target.value } })} className="h-10 w-14 shrink-0 rounded cursor-pointer border-0 bg-transparent" />
                <input value={i.theme?.headerBg ?? DEFAULT_THEME.headerBg} onChange={(e) => setI({ ...i, theme: { ...DEFAULT_THEME, ...i.theme, headerBg: e.target.value } })} placeholder="rgba(2,6,23,0.98) или #020617" className={input('flex-1 font-mono text-sm placeholder-slate-600')} />
              </div>
            </div>
          </div>
          <ThemePreview theme={i.theme ?? DEFAULT_THEME} />
        </div>
      </div>
      )}
      {tab === 'Блоки' && (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">Перетащите блоки стрелками вверх/вниз. Отметьте «Показать» для отображения на сайте.</p>
        <BlockOrderEditor
          order={i.blockOrder || ['hero', 'trustFacts', 'features', 'tariffs', 'faq']}
          blocks={Object.assign({ hero: true, trustFacts: true, features: true, tariffs: true, faq: true }, i.blocks || {})}
          onChange={(order, blocks) => setI({ ...i, blockOrder: order, blocks: { hero: true, trustFacts: true, features: true, tariffs: true, faq: true, ...blocks } as SiteInfo['blocks'] })}
        />
      </div>
      )}
      {tab === 'Контент' && (
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-300">Hero-блок</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Порядок элементов (стрелками вверх/вниз)</label>
              <ElementOrderEditor
                order={i.design?.heroElementOrder || ['logo', 'title', 'subtitle', 'button']}
                labels={{ logo: 'Логотип', title: 'Заголовок', subtitle: 'Подзаголовок', button: 'Кнопка' }}
                onChange={(order) => setI({ ...i, design: { ...i.design, heroElementOrder: order } })}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Заголовок</label>
              <input value={i.hero?.title ?? ''} onChange={(e) => setI({ ...i, hero: { ...i.hero, title: e.target.value } })} placeholder="AFINA" className={input('placeholder-slate-600')} />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Подзаголовок</label>
              <textarea value={i.hero?.subtitle ?? ''} onChange={(e) => setI({ ...i, hero: { ...i.hero, subtitle: e.target.value } })} rows={3} className={input('placeholder-slate-600')} />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Текст кнопки</label>
              <input value={i.hero?.buttonText ?? ''} onChange={(e) => setI({ ...i, hero: { ...i.hero, buttonText: e.target.value } })} placeholder="Подключиться" className={input('placeholder-slate-600')} />
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-300">Факты доверия</h3>
          <p className="mb-2 text-xs text-slate-500">Измените порядок стрелками, добавляйте и удаляйте</p>
          <ReorderableList
            items={i.trustFacts ?? []}
            onChange={(items) => setI({ ...i, trustFacts: items })}
            onAdd={() => ({ title: '', value: '' })}
            renderItem={(f, _, updateItem) => (
              <div className="grid gap-2 grid-cols-2">
                <input value={f.title} onChange={(e) => updateItem({ ...f, title: e.target.value })} placeholder="Заголовок" className={input('placeholder-slate-600 text-sm')} />
                <input value={f.value} onChange={(e) => updateItem({ ...f, value: e.target.value })} placeholder="Значение" className={input('placeholder-slate-600 text-sm')} />
              </div>
            )}
            emptyLabel="Добавьте факты"
          />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-300">Блок преимуществ</h3>
          <input value={i.featuresBlock?.title ?? ''} onChange={(e) => setI({ ...i, featuresBlock: { ...i.featuresBlock, title: e.target.value } })} placeholder="Заголовок блока" className={`${input('placeholder-slate-600')} mb-3`} />
          <ReorderableList
            items={i.featuresBlock?.items ?? []}
            onChange={(items) => setI({ ...i, featuresBlock: { ...i.featuresBlock, items } })}
            onAdd={() => ({ title: '', description: '' })}
            renderItem={(f, _, updateItem) => (
              <div className="space-y-2">
                <input value={f.title} onChange={(e) => updateItem({ ...f, title: e.target.value })} placeholder="Заголовок" className={input('placeholder-slate-600 text-sm')} />
                <textarea value={f.description} onChange={(e) => updateItem({ ...f, description: e.target.value })} placeholder="Описание" rows={2} className={input('placeholder-slate-600 text-sm')} />
              </div>
            )}
            emptyLabel="Добавьте преимущества"
          />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-300">Блок тарифов</h3>
          <div className="space-y-2">
            <input value={i.tariffsBlock?.title ?? ''} onChange={(e) => setI({ ...i, tariffsBlock: { ...i.tariffsBlock, title: e.target.value } })} placeholder="Заголовок" className={input('placeholder-slate-600')} />
            <textarea value={i.tariffsBlock?.subtitle ?? ''} onChange={(e) => setI({ ...i, tariffsBlock: { ...i.tariffsBlock, subtitle: e.target.value } })} rows={2} placeholder="Подзаголовок" className={input('placeholder-slate-600')} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400">Текст в подвале (copyright)</label>
          <input value={i.footer?.copyright ?? ''} onChange={(e) => setI({ ...i, footer: { ...i.footer, copyright: e.target.value } })} placeholder="AFINA VPN. Протокол VLESS." className={input('placeholder-slate-600')} />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-300">FAQ</h3>
          <p className="mb-2 text-xs text-slate-500">Порядок вопросов можно менять стрелками</p>
          <ReorderableList
            items={i.faq ?? []}
            onChange={(items) => setI({ ...i, faq: items })}
            onAdd={() => ({ question: '', answer: '' })}
            renderItem={(f, _, updateItem) => (
              <div className="space-y-2">
                <input value={f.question} onChange={(e) => updateItem({ ...f, question: e.target.value })} placeholder="Вопрос" className={input('placeholder-slate-600 text-sm')} />
                <textarea value={f.answer} onChange={(e) => updateItem({ ...f, answer: e.target.value })} placeholder="Ответ" rows={2} className={input('placeholder-slate-600 text-sm')} />
              </div>
            )}
            emptyLabel="Добавьте вопросы"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400">Инструкция «Как подключиться»</label>
          <div className="grid gap-4 md:grid-cols-2">
            <textarea value={i.instructions ?? ''} onChange={(e) => setI({ ...i, instructions: e.target.value })} rows={10} className={input('')} placeholder="# Заголовок" />
            <MarkdownPreview text={i.instructions ?? ''} />
          </div>
        </div>
      </div>
      )}
      {tab === 'Дизайн' && (
      <div className="space-y-6">
        <p className="text-sm text-slate-500">Тонкая настройка оформления. Tailwind-классы (например: text-5xl, py-20, rounded-xl)</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-slate-400">Размер заголовка Hero</label>
            <input value={i.design?.heroTitleSize ?? ''} onChange={(e) => setI({ ...i, design: { ...i.design, heroTitleSize: e.target.value } })} placeholder="text-5xl md:text-6xl lg:text-7xl" className={input('placeholder-slate-600 font-mono text-sm')} />
          </div>
          <div>
            <label className="block text-sm text-slate-400">Размер подзаголовка Hero</label>
            <input value={i.design?.heroSubtitleSize ?? ''} onChange={(e) => setI({ ...i, design: { ...i.design, heroSubtitleSize: e.target.value } })} placeholder="text-lg md:text-xl" className={input('placeholder-slate-600 font-mono text-sm')} />
          </div>
          <div>
            <label className="block text-sm text-slate-400">Отступы секций (вертикальные)</label>
            <input value={i.design?.sectionPadding ?? ''} onChange={(e) => setI({ ...i, design: { ...i.design, sectionPadding: e.target.value } })} placeholder="py-16 md:py-20" className={input('placeholder-slate-600 font-mono text-sm')} />
          </div>
          <div>
            <label className="block text-sm text-slate-400">Скругление карточек</label>
            <input value={i.design?.cardRadius ?? ''} onChange={(e) => setI({ ...i, design: { ...i.design, cardRadius: e.target.value } })} placeholder="rounded-xl" className={input('placeholder-slate-600 font-mono text-sm')} />
          </div>
          <div>
            <label className="block text-sm text-slate-400">Скругление кнопок</label>
            <input value={i.design?.buttonRadius ?? ''} onChange={(e) => setI({ ...i, design: { ...i.design, buttonRadius: e.target.value } })} placeholder="rounded-full" className={input('placeholder-slate-600 font-mono text-sm')} />
          </div>
        </div>
      </div>
      )}
      {tab === 'Документы' && (
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400">Текст оферты</label>
          <textarea value={i.offerta ?? ''} onChange={(e) => setI({ ...i, offerta: e.target.value })} rows={12} className={input('')} />
        </div>
        <div>
          <label className="block text-sm text-slate-400">Текст соглашения</label>
          <textarea value={i.agreement ?? ''} onChange={(e) => setI({ ...i, agreement: e.target.value })} rows={10} className={input('')} />
        </div>
      </div>
      )}
      </div>
      <div className="p-6 border-t border-teal-500/20">
        <button onClick={() => onSave(i)} disabled={saving} className="rounded-lg bg-amber-500 px-6 py-2 font-medium text-slate-900 hover:bg-amber-400 disabled:opacity-50">
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}

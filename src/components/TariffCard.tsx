import type { Tariff } from '@/lib/data';
import { CURRENCY_SYMBOLS } from '@/lib/constants';

interface TariffCardProps {
  tariff: Tariff;
  cardRadius?: string;
  buttonRadius?: string;
}

function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${price} ${symbol}`;
}

export function TariffCard({ tariff, cardRadius = 'rounded-xl', buttonRadius = 'rounded-lg' }: TariffCardProps) {
  const currency = tariff.currency || 'RUB';
  return (
    <div
      className={`relative flex h-full flex-col border p-6 transition-all duration-300 ${cardRadius} ${
        tariff.popular
          ? 'border-amber-500/50 bg-slate-800/80 shadow-lg shadow-amber-500/10'
          : 'border-teal-500/20 bg-slate-800/50 hover:border-teal-500/40'
      }`}
    >
      {tariff.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500/90 px-3 py-0.5 text-xs font-medium text-slate-900">
          Популярный
        </div>
      )}
      <h3 className="text-xl font-semibold text-slate-100">{tariff.name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-amber-400">{formatPrice(tariff.price, currency)}</span>
        <span className="text-slate-500">/ {tariff.period}</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {tariff.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-slate-300">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={tariff.buttonUrl || '#'}
        className={`mt-6 block w-full shrink-0 py-3 text-center font-medium transition ${buttonRadius} ${
          tariff.popular
            ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
            : 'border border-teal-500/50 text-teal-400 hover:border-teal-400 hover:bg-teal-500/10'
        }`}
      >
        Подключиться
      </a>
    </div>
  );
}

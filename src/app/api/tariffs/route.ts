import { NextResponse } from 'next/server';
import { getTariffs, saveTariffs, type Tariff } from '@/lib/data';

export async function GET() {
  const tariffs = await getTariffs();
  return NextResponse.json(tariffs);
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<Tariff>;
  const tariffs = await getTariffs();
  const id = crypto.randomUUID();
  const newTariff: Tariff = {
    id,
    name: body.name ?? 'Новый тариф',
    price: body.price ?? 0,
    currency: body.currency ?? 'RUB',
    period: body.period ?? '1 месяц',
    features: Array.isArray(body.features) ? body.features : [],
    popular: body.popular ?? false,
    sortOrder: body.sortOrder ?? tariffs.length + 1,
    buttonUrl: body.buttonUrl ?? '',
  };
  tariffs.push(newTariff);
  await saveTariffs(tariffs);
  return NextResponse.json(newTariff);
}

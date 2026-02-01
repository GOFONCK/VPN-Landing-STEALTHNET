import { NextRequest, NextResponse } from 'next/server';
import { getTariffs, saveTariffs, type Tariff } from '@/lib/data';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as Partial<Tariff>;
  const tariffs = await getTariffs();
  const index = tariffs.findIndex((t) => t.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  tariffs[index] = { ...tariffs[index], ...body, id };
  await saveTariffs(tariffs);
  return NextResponse.json(tariffs[index]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tariffs = await getTariffs();
  const filtered = tariffs.filter((t) => t.id !== id);
  if (filtered.length === tariffs.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await saveTariffs(filtered);
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { getSiteInfo, saveSiteInfo, type SiteInfo } from '@/lib/data';

export async function GET() {
  const info = await getSiteInfo();
  return NextResponse.json(info);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Partial<SiteInfo>;
    const current = await getSiteInfo();
    const updated: SiteInfo = {
      ...current,
      ...body,
      contacts: { ...current.contacts, ...(body.contacts ?? {}) },
    };
    await saveSiteInfo(updated);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка записи';
    const isPermission = message.includes('EACCES') || message.includes('EPERM');
    return NextResponse.json(
      { error: isPermission ? 'Нет прав на запись в data/. В Docker выполните: chown -R 1001:1001 data' : message },
      { status: 500 }
    );
  }
}

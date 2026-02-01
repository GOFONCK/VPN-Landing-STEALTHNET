import { NextRequest, NextResponse } from 'next/server';
import { getSiteInfo, saveSiteInfo, type SiteInfo } from '@/lib/data';

export async function GET() {
  const info = await getSiteInfo();
  return NextResponse.json(info);
}

export async function PUT(request: NextRequest) {
  const body = await request.json() as Partial<SiteInfo>;
  const current = await getSiteInfo();
  const updated: SiteInfo = {
    ...current,
    ...body,
    contacts: { ...current.contacts, ...(body.contacts ?? {}) },
  };
  await saveSiteInfo(updated);
  return NextResponse.json(updated);
}

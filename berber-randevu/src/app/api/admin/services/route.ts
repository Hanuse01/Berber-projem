import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
    }
    const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
    }
    const { name, price } = await req.json();

    // Veri doğrulama
    if (!name || typeof price !== 'number') {
      return NextResponse.json({ error: 'Eksik veya hatalı bilgi' }, { status: 400 });
    }

    const service = await prisma.service.create({ data: { name, price } });
    return NextResponse.json(service);
  } catch (e: any) {
    // Hata mesajını logla ve döndür
    console.error('Service ekleme hatası:', e);
    return NextResponse.json({ error: e.message || 'Bilinmeyen hata' }, { status: 500 });
  }
} 
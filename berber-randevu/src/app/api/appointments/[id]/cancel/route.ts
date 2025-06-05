import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const appointment = await prisma.appointment.findUnique({ where: { id: params.id } });
    if (!appointment || appointment.userId !== decoded.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
    }
    await prisma.appointment.update({ where: { id: params.id }, data: { status: 'CANCELLED' } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 400 });
  }
} 
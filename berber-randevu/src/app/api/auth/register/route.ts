import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { name, email, password, phone } = await req.json();
  if (!name || !email || !password || !phone) {
    return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Bu e-posta ile kayıtlı kullanıcı var.' }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone },
  });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
} 
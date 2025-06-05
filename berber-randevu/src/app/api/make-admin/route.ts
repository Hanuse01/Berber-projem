import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  // Kullanıcıyı bul
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
  }
  // Şifreyi kontrol et
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Şifre yanlış' }, { status: 401 });
  }
  // Admin yap
  const updated = await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
  return NextResponse.json({ success: true, user: updated });
} 
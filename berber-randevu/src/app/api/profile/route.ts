import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { name, password, image, phone } = await req.json();
    const data: any = { name };
    if (typeof image !== 'undefined') data.image = image;
    if (typeof phone !== 'undefined') data.phone = phone;
    if (password && password.length > 0) {
      data.password = await bcrypt.hash(password, 10);
    }
    await prisma.user.update({ where: { id: decoded.id }, data });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 400 });
  }
} 
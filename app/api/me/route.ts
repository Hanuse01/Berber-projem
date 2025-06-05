import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';

// Kullanıcı bilgilerini getir
export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
}

// Kullanıcı bilgilerini güncelle
export async function PUT(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { phone } = await req.json();

    // Telefon numarası formatını kontrol et
    const phoneRegex = /^5[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Geçerli bir telefon numarası giriniz (5XX XXX XX XX)' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { phone },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profil güncellenirken hata:', error);
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 400 });
  }
} 
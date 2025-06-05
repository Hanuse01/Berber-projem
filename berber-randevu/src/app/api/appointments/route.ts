// Kullanıcıya ait randevuları listeleyen ve yeni randevu oluşturan endpointler
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';

// Kullanıcının kendi randevularını listeler
export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    // Giriş yapmamışsa boş dizi döner
    return NextResponse.json([], { status: 200 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const appointments = await prisma.appointment.findMany({
      where: { userId: decoded.id },
      include: { service: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// Yeni randevu oluşturur
export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { serviceId, date } = await req.json();

    // Tarih kontrolü: Geçmiş bir tarihe randevu alınamaz
    const now = new Date();
    const selectedDate = new Date(date);
    if (selectedDate < now) {
      return NextResponse.json({ error: 'Geçmiş bir tarihe randevu alınamaz.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: decoded.id,
        serviceId,
        date: new Date(date),
        status: 'PENDING',
      },
    });
    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 400 });
  }
} 
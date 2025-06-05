import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { sendAppointmentReminder } from '@/lib/sms';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';

// Kullanıcının kendi randevularını listeler
export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
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

    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { phone: true },
    });

    if (!user?.phone) {
      return NextResponse.json({ error: 'Telefon numaranızı profil sayfanızdan eklemelisiniz' }, { status: 400 });
    }

    // Hizmet bilgilerini al
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { name: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Hizmet bulunamadı' }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: decoded.id,
        serviceId,
        date: new Date(date),
        status: 'PENDING',
      },
      include: {
        service: true,
      },
    });

    // SMS gönder
    try {
      await sendAppointmentReminder(user.phone, new Date(date), service.name);
    } catch (error) {
      console.error('SMS gönderilemedi:', error);
      // SMS gönderilemese bile randevu oluşturuldu
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Randevu oluşturulurken hata:', error);
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 400 });
  }
} 
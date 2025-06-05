import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const date = searchParams.get('date');
  const serviceId = searchParams.get('serviceId');

  if (!date || !serviceId) {
    return NextResponse.json({ error: 'Tarih ve hizmet ID\'si gerekli' }, { status: 400 });
  }

  try {
    // Seçilen tarihteki tüm randevuları al
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: new Date(date + 'T00:00:00'),
          lt: new Date(date + 'T23:59:59'),
        },
        serviceId,
        status: {
          not: 'CANCELLED',
        },
      },
      include: {
        service: true,
      },
    });

    // Çalışma saatleri
    const workingHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00'
    ];

    // Dolu saatleri bul
    const bookedHours = appointments.map(app => {
      const appointmentDate = new Date(app.date);
      return appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    });

    // Müsait saatleri filtrele
    const availableHours = workingHours.filter(hour => !bookedHours.includes(hour));

    return NextResponse.json(availableHours);
  } catch (error) {
    console.error('Müsait saatler alınırken hata:', error);
    return NextResponse.json({ error: 'Müsait saatler alınamadı' }, { status: 500 });
  }
} 
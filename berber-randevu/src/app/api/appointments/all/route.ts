import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { status: 'CONFIRMED' },
      include: { service: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
} 
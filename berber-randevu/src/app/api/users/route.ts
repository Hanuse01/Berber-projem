import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json([], { status: 200 });
  try {
    jwt.verify(token, JWT_SECRET);
    const users = await prisma.user.findMany({ select: { id: true, name: true, image: true }, orderBy: { name: 'asc' } });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
} 
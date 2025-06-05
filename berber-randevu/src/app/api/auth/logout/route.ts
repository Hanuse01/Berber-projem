import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Çıkış yapıldı' });
  response.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
} 
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin sayfaları için kontrol
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Korumalı sayfalar için kontrol
  const protectedPaths = ['/profile', '/appointments', '/messages'];
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/appointments/:path*', '/messages/:path*']
}; 
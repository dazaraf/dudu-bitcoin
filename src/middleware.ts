import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/lionsgate') return NextResponse.next();

  const password = process.env.LIONSGATE_PASSWORD;
  if (!password) return new NextResponse('Not configured', { status: 500 });

  const expected = `Basic ${btoa(`guest:${password}`)}`;
  if (request.headers.get('authorization') === expected) return NextResponse.next();

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Private"' },
  });
}

export const config = {
  matcher: ['/lionsgate'],
};

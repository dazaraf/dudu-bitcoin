import { NextRequest, NextResponse } from 'next/server';

// Gate config: map path → env var holding the password.
const GATES: Record<string, string> = {
  '/lionsgate': 'LIONSGATE_PASSWORD',
  '/crymbo':    'CRYMBO_PASSWORD',
};

export function middleware(request: NextRequest) {
  const envVar = GATES[request.nextUrl.pathname];
  if (!envVar) return NextResponse.next();

  const password = process.env[envVar];
  if (!password) return new NextResponse('Not configured', { status: 500 });

  const expected = `Basic ${btoa(`guest:${password}`)}`;
  if (request.headers.get('authorization') === expected) return NextResponse.next();

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Private"' },
  });
}

export const config = {
  matcher: ['/lionsgate', '/crymbo'],
};

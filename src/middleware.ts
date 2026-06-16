import { NextRequest, NextResponse } from 'next/server';

// Basic-Auth gates: map exact path → env var holding the password.
const BASIC_AUTH_GATES: Record<string, string> = {
  '/lionsgate': 'LIONSGATE_PASSWORD',
  '/crymbo':    'CRYMBO_PASSWORD',
  '/oobit':     'OOBIT_PASSWORD',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Post-generator: cookie-based gate. The entry page (/post-generator) is public.
  if (pathname.startsWith('/post-generator/')) {
    const hasCode = request.cookies.get('pg_code')?.value;
    if (!hasCode) {
      const url = request.nextUrl.clone();
      url.pathname = '/post-generator';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Basic-Auth gates
  const envVar = BASIC_AUTH_GATES[pathname];
  if (!envVar) return NextResponse.next();

  const password = process.env[envVar];
  if (!password) return new NextResponse('Not configured', { status: 500 });

  let expected: string | null = null;
  try { expected = `Basic ${btoa(`guest:${password}`)}`; } catch { expected = null; }
  if (expected && request.headers.get('authorization') === expected) return NextResponse.next();

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Private"' },
  });
}

export const config = {
  matcher: ['/lionsgate', '/crymbo', '/oobit', '/post-generator/:path+'],
};

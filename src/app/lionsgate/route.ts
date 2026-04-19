export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.LIONSGATE_BLOB_URL;
  if (!url) return new Response('Not configured', { status: 500 });

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return new Response('Not found', { status: 404 });

  return new Response(await res.text(), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

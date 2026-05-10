// One-shot: uploads the Crymbo GTM brief to Vercel Blob (private URL, not listed).
// Run from site/: node --env-file=.env.local scripts/upload-crymbo-brief.mjs
import { put } from '@vercel/blob';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SOURCE = resolve(process.cwd(), '../ceo/proposals/crymbo/gtm-brief.html');

const html = await readFile(SOURCE, 'utf8');
const blob = await put('crymbo-brief.html', html, {
  access: 'public',
  contentType: 'text/html; charset=utf-8',
  addRandomSuffix: true,
  allowOverwrite: true,
});

console.log('Uploaded. Save this URL as CRYMBO_BLOB_URL env var on Vercel:');
console.log(blob.url);

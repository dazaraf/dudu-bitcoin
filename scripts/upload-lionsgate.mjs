// One-shot: uploads public/lionsgate.html to Vercel Blob (private-ish: random URL, not listed)
// Run: node --env-file=.env.local scripts/upload-lionsgate.mjs
import { put } from '@vercel/blob';
import { readFile } from 'node:fs/promises';

const html = await readFile('public/lionsgate.html', 'utf8');
const blob = await put('lionsgate.html', html, {
  access: 'public',
  contentType: 'text/html; charset=utf-8',
  addRandomSuffix: true,
  allowOverwrite: true,
});

console.log('Uploaded. Save this URL as LIONSGATE_BLOB_URL env var:');
console.log(blob.url);

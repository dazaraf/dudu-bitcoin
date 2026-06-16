// One-shot: uploads the Oobit proposal (self-contained, images inlined) to Vercel Blob.
// Run from site/: node --env-file=.env.local scripts/upload-oobit.mjs
import { put } from '@vercel/blob';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SOURCE = resolve(process.cwd(), '../ceo/proposals/oobit/oobit-proposal.html');

const html = await readFile(SOURCE, 'utf8');
const blob = await put('oobit-proposal.html', html, {
  access: 'public',
  contentType: 'text/html; charset=utf-8',
  addRandomSuffix: true,
  allowOverwrite: true,
});

console.log('Uploaded. Save this URL as OOBIT_BLOB_URL env var on Vercel:');
console.log(blob.url);

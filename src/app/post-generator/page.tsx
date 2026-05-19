import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCode, getProfile, ensureReady } from '@/lib/post-generator/db';
import CodeEntry from './CodeEntry';

export const dynamic = 'force-dynamic';

export default async function PostGeneratorIndex() {
  await ensureReady();
  const jar = await cookies();
  const existingCode = jar.get('pg_code')?.value;

  if (existingCode) {
    const row = await getCode(existingCode);
    if (row) {
      const profile = await getProfile(existingCode);
      if (profile?.bio?.trim()) redirect('/post-generator/today');
      redirect('/post-generator/onboarding');
    }
  }

  return <CodeEntry />;
}

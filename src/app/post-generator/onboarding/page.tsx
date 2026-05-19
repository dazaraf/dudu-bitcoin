import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCode, getProfile } from '@/lib/post-generator/db';
import OnboardingFlow from './OnboardingFlow';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const jar = await cookies();
  const code = jar.get('pg_code')?.value;
  if (!code) redirect('/post-generator');
  const row = await getCode(code);
  if (!row) redirect('/post-generator');

  const existing = await getProfile(code);
  return (
    <div className="animate-in min-h-screen flex flex-col">
      <OnboardingFlow initial={existing} />
    </div>
  );
}

import type { ReactNode } from 'react';
import './post-generator.css';

export const metadata = {
  title: 'Post Generator',
  description: 'Wake up to five drafts in your voice.',
};

export default function PostGeneratorLayout({ children }: { children: ReactNode }) {
  return <div className="pg-root font-pg-sans text-pg-ink paper-grain">{children}</div>;
}

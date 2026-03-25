const size = 28;

function Gold() {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      <text x="14" y="18" textAnchor="middle" fill="#8B6914" fontSize="11" fontWeight="800" fontFamily="system-ui">
        Au
      </text>
    </svg>
  );
}

function Silver() {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#E8E8E8" stroke="#B0B0B0" strokeWidth="1" />
      <text x="14" y="18" textAnchor="middle" fill="#666" fontSize="11" fontWeight="800" fontFamily="system-ui">
        Ag
      </text>
    </svg>
  );
}

function Nvidia() {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="1" y="1" width="26" height="26" rx="6" fill="#76B900" />
      <path
        d="M11 8.5c3.5-.4 5.5 2 6.2 3.5-1.2-.8-2.8-1.3-4.2-1.1-2.8.3-4.2 2.8-4.2 2.8s1.5-2.4 4.2-2.7c1-.1 2 .2 2.8.6-.8-1-2.4-2.2-4.8-1.8-2.8.5-4 3.2-4 3.2v3.2c0 0 1.8-3.4 5-3.8 2-.3 3.8.6 4.8 1.4l.2.2v-2s-2-2.8-6-2.5z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}

function Alphabet() {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      <path d="M14 5a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" fill="none" />
      {/* Simplified Google G */}
      <path
        d="M14 7.5c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5c3.2 0 5.8-2.1 6.3-5h-6.3v-2.5h9c.1.5.1 1 .1 1.5 0 5-3.6 8.5-8.8 8.5A9 9 0 0 1 5 14 9 9 0 0 1 14 5c2.3 0 4.3.8 5.8 2.2l-2.4 2.3C16.3 8.5 15.2 7.5 14 7.5z"
        fill="#4285F4"
      />
      <path d="M7.5 11.5l2.8 2c.5-1.5 1.8-2.5 3.7-2.5 1.2 0 2.3.5 3.1 1.3L19.5 10C18 8.3 16.1 7.5 14 7.5c-2.7 0-5 1.6-6 4z" fill="#EA4335" />
      <path d="M7.5 16.5c1 2.4 3.3 4 6 4 1.8 0 3.3-.5 4.5-1.5l-2.5-2c-.6.4-1.3.6-2 .6-1.9 0-3.2-1-3.7-2.5l-2.8 2c-.3.5.3.9.5 1.4z" fill="#34A853" />
      <path d="M20.5 11.5h-6.5v3h3.8c-.3 1.2-1.3 2-2.8 2.3l2.5 2c1.5-1.4 2.5-3.5 2.5-6 0-.5 0-1-.1-1.3z" fill="#FBBC05" />
    </svg>
  );
}

function Apple() {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#1D1D1F" />
      <path
        d="M17.2 8.3c-.7.8-1.8 1.4-2.8 1.3-.1-1.1.4-2.3 1-3 .7-.8 1.9-1.4 2.8-1.4.1 1.2-.3 2.3-1 3.1zm1 1.6c-1.6-.1-2.9.9-3.7.9-.8 0-1.9-.8-3.2-.8-1.6 0-3.2 1-4 2.5-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2-.1 1.7-.8 3.1-.8s1.9.8 3.2.7c1.3 0 2.1-1.2 2.9-2.4.5-.8.9-1.5 1.2-2.3-3-.1-3.7-4-3.7-4s0-.1 0-.2c.1-2.2 1.8-3.3 2-3.4-.1-.1-1.4-2.2-4-2.4z"
        fill="white"
        transform="translate(0 1) scale(0.85)"
      />
    </svg>
  );
}

function Microsoft() {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="1" y="1" width="26" height="26" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      <rect x="6" y="6" width="7" height="7" fill="#F25022" rx="1" />
      <rect x="15" y="6" width="7" height="7" fill="#7FBA00" rx="1" />
      <rect x="6" y="15" width="7" height="7" fill="#00A4EF" rx="1" />
      <rect x="15" y="15" width="7" height="7" fill="#FFB900" rx="1" />
    </svg>
  );
}

function Amazon() {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="1" y="1" width="26" height="26" rx="6" fill="#232F3E" />
      <path
        d="M8 15.5c0 0 3.5 2.5 7 2.5s5-1 5-1"
        stroke="#FF9900"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18 16l2.5-1-0.5 2.5"
        stroke="#FF9900"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text x="14" y="13" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui">
        a
      </text>
    </svg>
  );
}

const logos: Record<string, () => React.JSX.Element> = {
  gold: Gold,
  silver: Silver,
  nvidia: Nvidia,
  alphabet: Alphabet,
  apple: Apple,
  microsoft: Microsoft,
  amazon: Amazon,
};

export default function AssetLogo({ assetKey }: { assetKey: string }) {
  const Logo = logos[assetKey];
  if (!Logo) return <span className="w-7 h-7 rounded-full bg-white/10" />;
  return <Logo />;
}

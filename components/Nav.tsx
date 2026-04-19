'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Nav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            <span className="text-violet-400">Drift</span>Pay
          </Link>
          <div className="hidden md:flex gap-6 text-sm">
            {[
              { href: '/send', label: 'Send' },
              { href: '/dashboard', label: 'Dashboard' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  pathname === href ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        {mounted ? (
          <WalletMultiButton className="!bg-violet-600 hover:!bg-violet-500 !rounded-lg !h-9 !text-sm !py-0" />
        ) : (
          <div className="h-9 w-32 bg-gray-800 rounded-lg animate-pulse" />
        )}
      </div>
    </nav>
  );
}

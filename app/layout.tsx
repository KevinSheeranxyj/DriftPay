import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';
import { Nav } from '@/components/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DriftPay — Yield-Aware Payments',
  description: 'Your money earns while it travels.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <WalletProvider>
          <Nav />
          <main>{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}

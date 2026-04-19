'use client';

import { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

// Cast needed: wallet-adapter types predate React 18's stricter FC signature
const CP = ConnectionProvider as FC<{ endpoint: string; children?: ReactNode }>;
const WP = SolanaWalletProvider as FC<{
  wallets: InstanceType<typeof PhantomWalletAdapter>[];
  autoConnect?: boolean;
  children?: ReactNode;
}>;
const WMP = WalletModalProvider as FC<{ children?: ReactNode }>;

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC ?? 'https://api.mainnet-beta.solana.com';
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <CP endpoint={endpoint}>
      <WP wallets={wallets} autoConnect>
        <WMP>{children}</WMP>
      </WP>
    </CP>
  );
};

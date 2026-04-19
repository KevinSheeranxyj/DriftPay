'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { ProtocolCard } from '@/components/ProtocolCard';
import { pickProtocol, projectYield } from '@/lib/router';
import { useStore } from '@/lib/store';
import type { ProtocolScore } from '@/lib/router';

const TTL_OPTIONS = [
  { label: '1h', hours: 1 },
  { label: '6h', hours: 6 },
  { label: '12h', hours: 12 },
  { label: '24h', hours: 24 },
  { label: '48h', hours: 48 },
  { label: '7d', hours: 168 },
];

export default function SendPage() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const addIntent = useStore((s) => s.addIntent);

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [ttlHours, setTtlHours] = useState(24);
  const [protocols, setProtocols] = useState<ProtocolScore[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const amountSOL = parseFloat(amount) || 0;
  const recommended = pickProtocol(protocols, ttlHours);

  const activeProtocol = selectedProtocol ?? recommended;
  const projectedYield = activeProtocol
    ? projectYield(amountSOL, activeProtocol.apy, ttlHours)
    : 0;

  useEffect(() => {
    fetch('/api/protocols')
      .then((r) => r.json())
      .then(({ protocols: p }) => {
        setProtocols(p ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const rec = pickProtocol(protocols, ttlHours);
    if (rec) setSelectedProtocol(rec);
  }, [ttlHours, protocols]);

  const handleSend = () => {
    if (!publicKey || !activeProtocol || !amountSOL || !recipient) return;
    setSubmitting(true);

    const mockSig = `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    const now = Date.now() / 1000;

    addIntent({
      sender: publicKey.toBase58(),
      recipient,
      amountSOL,
      ttlHours,
      protocol: activeProtocol.name,
      protocolAddress: activeProtocol.address,
      apy: activeProtocol.apy,
      depositTxSig: mockSig,
      status: 'parked',
      createdAt: now,
      settleAt: now + ttlHours * 3600,
    });

    setSubmitting(false);
    router.push('/dashboard');
  };

  const canSend = mounted && publicKey && amountSOL > 0 && recipient.length > 30 && activeProtocol;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Send a Payment</h1>
      <p className="text-gray-400 mb-10">
        Funds earn yield during transit. Recipient always gets full principal.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Amount (SOL)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:border-violet-500 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                SOL
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Solana wallet address..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Time to Live</label>
            <div className="grid grid-cols-6 gap-2">
              {TTL_OPTIONS.map(({ label, hours }) => (
                <button
                  key={hours}
                  onClick={() => setTtlHours(hours)}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    ttlHours === hours
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {amountSOL > 0 && activeProtocol && (
            <div className="bg-gradient-to-br from-violet-950/50 to-cyan-950/30 border border-violet-500/20 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-1">Projected yield for you</p>
              <p className="text-3xl font-bold text-violet-300">
                +{projectedYield.toFixed(6)} SOL
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {amountSOL} SOL × {activeProtocol.apy}% APY × {ttlHours}h ≈ $
                {(projectedYield * 150).toFixed(4)}
              </p>
            </div>
          )}

          {!mounted ? (
            <div className="h-12 bg-gray-800 rounded-xl animate-pulse" />
          ) : !publicKey ? (
            <WalletMultiButton className="!w-full !justify-center !bg-violet-600 hover:!bg-violet-500 !rounded-xl !h-12" />
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend || submitting}
              className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl font-semibold transition-colors"
            >
              {submitting
                ? 'Routing...'
                : `Send ${amountSOL || '0'} SOL via ${activeProtocol?.name ?? 'best protocol'}`}
            </button>
          )}
        </div>

        {/* Right: Protocol Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-300">Live Protocol Scores</h2>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Birdeye live data
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-4 h-28 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {protocols.map((p) => (
                <ProtocolCard
                  key={p.address}
                  {...p}
                  selected={activeProtocol?.address === p.address}
                  onSelect={() => setSelectedProtocol(p)}
                  recommended={recommended?.address === p.address}
                />
              ))}
            </div>
          )}

          {!loading && protocols.length > 0 && (
            <p className="text-xs text-gray-600 mt-3">
              Routing optimised for {ttlHours}h TTL —{' '}
              {ttlHours < 6 ? 'volatility-first (short TTL)' : 'APY-first (long TTL)'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function ReceiptPage() {
  const { id } = useParams();
  const getIntent = useStore((s) => s.getIntent);
  const intent = getIntent(id as string);

  if (!intent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400">Receipt not found.</p>
        <Link href="/dashboard" className="text-violet-400 text-sm mt-4 inline-block hover:text-violet-300">
          ← Dashboard
        </Link>
      </div>
    );
  }

  const fields: { label: string; value: string; mono?: boolean }[] = [
    { label: 'Intent ID', value: intent.id, mono: true },
    { label: 'Status', value: intent.status.toUpperCase() },
    { label: 'Sender', value: intent.sender, mono: true },
    { label: 'Recipient', value: intent.recipient, mono: true },
    { label: 'Amount', value: `${intent.amountSOL} SOL` },
    { label: 'Protocol', value: intent.protocol },
    { label: 'APY', value: `${intent.apy}%` },
    { label: 'TTL', value: `${intent.ttlHours}h` },
    { label: 'Created', value: new Date(intent.createdAt * 1000).toLocaleString() },
    { label: 'Settle at', value: new Date(intent.settleAt * 1000).toLocaleString() },
    { label: 'Deposit TX', value: intent.depositTxSig, mono: true },
    ...(intent.settleTxSig
      ? [{ label: 'Settle TX', value: intent.settleTxSig, mono: true }]
      : []),
    ...(intent.yieldEarnedSOL != null
      ? [{ label: 'Yield earned', value: `${intent.yieldEarnedSOL.toFixed(6)} SOL` }]
      : []),
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/dashboard"
        className="text-violet-400 text-sm mb-8 inline-flex items-center gap-1 hover:text-violet-300"
      >
        ← Dashboard
      </Link>

      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-950/60 to-cyan-950/30 border-b border-gray-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Payment Receipt</h1>
              <p className="text-xs text-gray-400">On-chain audit trail</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-800">
          {fields.map(({ label, value, mono }) => (
            <div key={label} className="flex items-start justify-between px-6 py-3.5 gap-4">
              <span className="text-sm text-gray-400 flex-shrink-0 w-28">{label}</span>
              <span
                className={`text-sm text-right break-all ${
                  mono ? 'font-mono text-gray-300' : 'text-white'
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

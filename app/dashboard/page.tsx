'use client';

import Link from 'next/link';
import { useStore, type PaymentIntent } from '@/lib/store';
import { useYieldTicker } from '@/hooks/useYieldTicker';

function IntentRow({ intent }: { intent: PaymentIntent }) {
  const settleIntent = useStore((s) => s.settleIntent);
  const isParked = intent.status === 'parked';
  const isExpired = Date.now() / 1000 > intent.settleAt;

  const earned = useYieldTicker(isParked ? intent.amountSOL : 0, intent.apy, intent.createdAt);

  const displayYield = isParked ? earned : (intent.yieldEarnedSOL ?? 0);

  const handleSettle = () => {
    const sig = `settle_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    settleIntent(intent.id, earned, sig);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                !isParked
                  ? 'bg-emerald-900/50 text-emerald-400'
                  : isExpired
                  ? 'bg-yellow-900/50 text-yellow-400'
                  : 'bg-violet-900/50 text-violet-400'
              }`}
            >
              {!isParked ? 'Settled' : isExpired ? 'Ready to settle' : 'Parked'}
            </span>
            <span className="text-xs text-gray-500">{intent.protocol}</span>
          </div>
          <p className="text-lg font-semibold">{intent.amountSOL} SOL</p>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            → {intent.recipient.slice(0, 8)}…{intent.recipient.slice(-6)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 mb-0.5">Yield earned</p>
          <p
            className={`text-xl font-bold tabular-nums ${
              !isParked ? 'text-emerald-400' : 'text-violet-400'
            }`}
          >
            +{displayYield.toFixed(6)}
            <span className="text-sm font-normal text-gray-400"> SOL</span>
          </p>
          <p className="text-xs text-gray-600">{intent.apy}% APY</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">
          {!isParked
            ? `Settled · ${new Date(intent.settleAt * 1000).toLocaleString()}`
            : `Settles ${new Date(intent.settleAt * 1000).toLocaleString()}`}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/receipt/${intent.id}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            Receipt
          </Link>
          {isParked && (
            <button
              onClick={handleSettle}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                isExpired
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {isExpired ? 'Settle now' : 'Early settle'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const intents = useStore((s) => s.intents);

  const active = intents.filter((i) => i.status === 'parked');
  const settled = intents.filter((i) => i.status === 'settled');
  const totalYield = settled.reduce((acc, i) => acc + (i.yieldEarnedSOL ?? 0), 0);

  if (!intents.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-10">Track active payment intents and yield.</p>
        <div className="text-center py-24 text-gray-600">
          <p className="text-lg">No active intents</p>
          <p className="text-sm mt-2 mb-6">Send your first yield-bearing payment</p>
          <Link
            href="/send"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium transition-colors text-white"
          >
            Send Payment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-400">Yield-bearing payment intents.</p>
        </div>
        <Link
          href="/send"
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium text-sm transition-colors"
        >
          + New Payment
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active', value: active.length.toString() },
          { label: 'Settled', value: settled.length.toString() },
          { label: 'Total yield captured', value: `${totalYield.toFixed(4)} SOL` },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xl font-bold text-violet-400">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {intents.map((intent) => (
          <IntentRow key={intent.id} intent={intent} />
        ))}
      </div>
    </div>
  );
}

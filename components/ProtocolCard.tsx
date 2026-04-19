'use client';

interface Props {
  name: string;
  apy: number;
  volatility: number;
  liquidity: number;
  safe: boolean;
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
}

export function ProtocolCard({ name, apy, volatility, liquidity, safe, selected, onSelect, recommended }: Props) {
  if (!safe) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 opacity-60 cursor-not-allowed">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm text-gray-400">{name}</p>
          <span className="text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded">Unsafe</span>
        </div>
        <p className="text-gray-600 text-sm mt-2">Failed security checks</p>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl border p-4 cursor-pointer transition-all relative ${
        selected
          ? 'border-violet-500 bg-violet-950/30 shadow-lg shadow-violet-500/10'
          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
      }`}
    >
      {recommended && (
        <span className="absolute -top-2.5 left-3 text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
          Recommended
        </span>
      )}
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-sm">{name}</p>
        {selected && (
          <span className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mt-1">
        {apy.toFixed(2)}%{' '}
        <span className="text-sm font-normal text-gray-400">APY</span>
      </p>
      <div className="flex gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          ${(liquidity / 1e6).toFixed(0)}M liquidity
        </span>
        <span className="flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              volatility < 0.05 ? 'bg-emerald-400' : volatility < 0.1 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
          />
          {(volatility * 100).toFixed(1)}% vol
        </span>
      </div>
    </div>
  );
}

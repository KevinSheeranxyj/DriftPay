import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      <div className="max-w-3xl w-full">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Powered by Birdeye live data
        </span>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Your payment{' '}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            earns yield
          </span>{' '}
          while it travels.
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
          DriftPay routes funds through the highest-yield, lowest-risk DeFi protocol during your
          payment&apos;s TTL window. Sender keeps the yield. Recipient gets full principal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/send"
            className="px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-lg transition-colors"
          >
            Send a Payment →
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold text-lg transition-colors"
          >
            View Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-24">
          {[
            { label: 'Avg APY', value: '9.7%' },
            { label: 'Protocols scored', value: '3' },
            { label: 'Yield on table', value: '$0' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-2xl font-bold text-violet-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              step: '01',
              title: 'Set your intent',
              desc: 'Enter amount, recipient, and how long the payment can travel.',
            },
            {
              step: '02',
              title: 'We route the yield',
              desc: 'Birdeye live data scores protocols by APY, volatility, and liquidity.',
            },
            {
              step: '03',
              title: 'Settle & collect',
              desc: 'Recipient gets full principal. You keep the yield delta.',
            },
          ].map((item) => (
            <div key={item.step} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <span className="text-violet-500 text-sm font-mono">{item.step}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

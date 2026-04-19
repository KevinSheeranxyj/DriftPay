import { NextResponse } from 'next/server';
import { getTokenSecurity, getVolatility, isSafe } from '@/lib/birdeye';
import type { ProtocolScore } from '@/lib/router';

const CANDIDATES = [
  {
    name: 'Kamino Finance',
    address: 'So11111111111111111111111111111111111111112',
    apy: 8.2,
    liquidity: 450_000_000,
  },
  {
    name: 'MarginFi',
    address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    apy: 6.8,
    liquidity: 280_000_000,
  },
  {
    name: 'Raydium',
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    apy: 14.2,
    liquidity: 120_000_000,
  },
];

export async function GET() {
  const protocols: ProtocolScore[] = await Promise.all(
    CANDIDATES.map(async (c) => {
      const [security, volatility] = await Promise.all([
        getTokenSecurity(c.address),
        getVolatility(c.address),
      ]);
      return {
        name: c.name,
        address: c.address,
        apy: c.apy,
        volatility,
        liquidity: c.liquidity,
        safe: isSafe(security),
      };
    })
  );

  return NextResponse.json({ protocols });
}

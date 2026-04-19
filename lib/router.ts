export interface ProtocolScore {
  name: string;
  address: string;
  apy: number;
  volatility: number;
  liquidity: number;
  safe: boolean;
}

export function pickProtocol(candidates: ProtocolScore[], ttlHours: number): ProtocolScore | null {
  const safe = candidates.filter((p) => p.safe && p.liquidity > 100_000);
  if (!safe.length) return null;

  const volatilityWeight = ttlHours < 6 ? 0.7 : 0.3;
  const apyWeight = 1 - volatilityWeight;

  return safe.sort((a, b) => {
    const scoreA = apyWeight * a.apy - volatilityWeight * a.volatility;
    const scoreB = apyWeight * b.apy - volatilityWeight * b.volatility;
    return scoreB - scoreA;
  })[0];
}

export function projectYield(amountSOL: number, apyPercent: number, ttlHours: number): number {
  return amountSOL * (apyPercent / 100) * (ttlHours / 8760);
}

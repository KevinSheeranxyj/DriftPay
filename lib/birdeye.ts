const BASE_URL = 'https://public-api.birdeye.so';

function headers() {
  return {
    'x-api-key': process.env.BIRDEYE_API_KEY ?? '',
    'x-chain': 'solana',
  };
}

export async function getTokenSecurity(address: string) {
  try {
    const res = await fetch(`${BASE_URL}/defi/token_security?address=${address}`, {
      headers: headers(),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function getVolatility(address: string): Promise<number> {
  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 86400;
    const res = await fetch(
      `${BASE_URL}/defi/ohlcv?address=${address}&type=1H&time_from=${from}&time_to=${to}`,
      { headers: headers(), next: { revalidate: 300 } }
    );
    if (!res.ok) return 0.05;
    const { data } = await res.json();
    if (!data?.items?.length) return 0.05;
    const closes: number[] = data.items.map((c: { c: number }) => c.c);
    const mean = closes.reduce((a, b) => a + b, 0) / closes.length;
    const variance = closes.reduce((a, b) => a + (b - mean) ** 2, 0) / closes.length;
    return Math.sqrt(variance) / mean;
  } catch {
    return 0.05;
  }
}

export function isSafe(security: Record<string, unknown> | null): boolean {
  if (!security) return true;
  if ((security.ownerPercentage as number) > 0.3) return false;
  if (security.isMutable === true) return false;
  if ((security.top10HolderPercent as number) > 0.8) return false;
  return true;
}

import type { PaymentIntent } from './store';

export async function simulateSettle(intent: PaymentIntent): Promise<{
  sig: string;
  yieldEarnedSOL: number;
}> {
  const elapsedSecs = Date.now() / 1000 - intent.createdAt;
  const perSecondRate = (intent.apy / 100) / (365 * 24 * 3600);
  const yieldEarnedSOL = intent.amountSOL * perSecondRate * elapsedSecs;
  const sig = `settle_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  return { sig, yieldEarnedSOL };
}

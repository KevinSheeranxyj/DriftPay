'use client';

import { useState, useEffect } from 'react';

export function useYieldTicker(amountSOL: number, apyPercent: number, startTime: number): number {
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    const tick = () => {
      const elapsedSecs = Date.now() / 1000 - startTime;
      const perSecondRate = (apyPercent / 100) / (365 * 24 * 3600);
      setEarned(amountSOL * perSecondRate * elapsedSecs);
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [amountSOL, apyPercent, startTime]);

  return earned;
}

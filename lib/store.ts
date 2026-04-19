import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentIntent {
  id: string;
  sender: string;
  recipient: string;
  amountSOL: number;
  ttlHours: number;
  protocol: string;
  protocolAddress: string;
  apy: number;
  depositTxSig: string;
  settleTxSig?: string;
  yieldEarnedSOL?: number;
  status: 'parked' | 'settled' | 'failed';
  createdAt: number;
  settleAt: number;
}

interface DriftPayStore {
  intents: PaymentIntent[];
  addIntent: (intent: Omit<PaymentIntent, 'id'>) => string;
  settleIntent: (id: string, yieldEarnedSOL: number, settleTxSig: string) => void;
  getIntent: (id: string) => PaymentIntent | undefined;
}

export const useStore = create<DriftPayStore>()(
  persist(
    (set, get) => ({
      intents: [],
      addIntent: (intent) => {
        const id = uuidv4();
        set((state) => ({ intents: [...state.intents, { ...intent, id }] }));
        return id;
      },
      settleIntent: (id, yieldEarnedSOL, settleTxSig) => {
        set((state) => ({
          intents: state.intents.map((i) =>
            i.id === id ? { ...i, status: 'settled' as const, yieldEarnedSOL, settleTxSig } : i
          ),
        }));
      },
      getIntent: (id) => get().intents.find((i) => i.id === id),
    }),
    { name: 'driftpay-store' }
  )
);

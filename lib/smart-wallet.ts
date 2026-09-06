'use client';

import { usePrivy, useSmartWallets } from '@/lib/mock-privy';
import { Address } from 'viem';

export function useSmartAddress(): Address | undefined {
  const { user } = usePrivy();
  return user?.smartWallet.address as Address | undefined;
}

export function useSmartWalletClient() {
  const { client } = useSmartWallets();
  return client;
}

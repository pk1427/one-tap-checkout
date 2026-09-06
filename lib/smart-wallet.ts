'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { Address } from 'viem';

export function useSmartAddress(): Address | undefined {
  const { user } = usePrivy();
  const { client } = useSmartWallets();

  if (user?.smartWallet?.address) {
    return user.smartWallet.address as Address;
  }

  if (client?.account?.address) {
    return client.account.address as Address;
  }

  return undefined;
}

export function useSmartWalletClient() {
  const { client } = useSmartWallets();
  return client;
}
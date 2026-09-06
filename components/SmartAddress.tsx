'use client';

import { usePrivy } from '@/lib/mock-privy';

export default function SmartAddress() {
  const { user } = usePrivy();
  const address = user?.smartWallet.address;

  if (!address) {
    return <span className="text-sm text-gray-500">Not connected</span>;
  }

  return (
    <span className="text-sm font-mono text-gray-900">
      {address.slice(0, 6)}...{address.slice(-4)}
    </span>
  );
}

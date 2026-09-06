'use client';

import { useSmartAddress } from '@/lib/smart-wallet';
import { truncateAddress } from '@/lib/utils';

export default function SmartAddress() {
  const address = useSmartAddress();

  if (!address) {
    return <span className="text-gray-500">Not connected</span>;
  }

  return (
    <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
      {truncateAddress(address)}
    </span>
  );
}

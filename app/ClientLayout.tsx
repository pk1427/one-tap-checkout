'use client';

import { baseSepolia } from 'viem/chains';

export default function ClientOnlyPrivy({
  appId,
  children,
}: {
  appId: string;
  children: React.ReactNode;
}) {
  if (!appId) {
    return <>{children}</>;
  }

  return (
    <div data-privy-app-id={appId} data-chain-id={baseSepolia.id}>
      {children}
    </div>
  );
}

'use client';

import { PrivyProvider } from '@privy-io/react-auth';
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
    <PrivyProvider
      appId={appId}
      config={{
        supportedChains: [baseSepolia],
        loginMethods: ['email', 'google', 'wallet'],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users',
          },
          showWalletUIs: false,
        },
        appearance: {
          theme: 'light',
          accentColor: '#2563eb',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

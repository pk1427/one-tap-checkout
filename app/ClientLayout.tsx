'use client';

import { useState, useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';

export default function ClientOnlyPrivy({
  appId,
  children,
}: {
  appId: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !appId) {
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

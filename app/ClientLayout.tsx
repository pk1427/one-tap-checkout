'use client';

import dynamic from 'next/dynamic';
import { baseSepolia } from "viem/chains";

const PrivyProvider = dynamic(
  () => import('@privy-io/react-auth').then((mod) => mod.PrivyProvider),
  { ssr: false }
);

const SmartWalletsProvider = dynamic(
  () => import('@privy-io/react-auth/smart-wallets').then((mod) => mod.SmartWalletsProvider),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;
  const appId = privyAppId || privyClientId || '';

  if (!appId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Missing NEXT_PUBLIC_PRIVY_APP_ID or NEXT_PUBLIC_PRIVY_CLIENT_ID</div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        supportedChains: [baseSepolia],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users',
          },
        },
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#2563eb',
        },
      }}
    >
      <SmartWalletsProvider
        config={{
          paymasterContext: {},
        }}
      >
        {children}
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
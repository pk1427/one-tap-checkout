'use client';

import { useState, useEffect, useCallback } from 'react';

type SmartWalletInfo = {
  address: string;
  type: 'smart_wallet';
};

type MockPrivyState = {
  ready: boolean;
  authenticated: boolean;
  login: (opts?: { loginMethods?: string[] }) => Promise<void>;
  logout: () => Promise<void>;
  user: { id: string; smartWallet: SmartWalletInfo } | null;
  getAccessToken: () => Promise<string>;
};

const MOCK_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38';
const MOCK_DID = 'did:privy:demo-smart-wallet';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type SmartWalletClient = {
  address: `0x${string}`;
  sendTransaction: (args: { calls: { to: `0x${string}`; data: `0x${string}` }[] }) => Promise<`0x${string}`>;
};

let globalUser: { id: string; smartWallet: SmartWalletInfo } | null = null;
const listeners = new Set<(user: typeof globalUser) => void>();
function emitListeners() {
  listeners.forEach((fn) => fn(globalUser));
}

export function usePrivy(): MockPrivyState {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; smartWallet: SmartWalletInfo } | null>(globalUser);

  useEffect(() => {
    const handler = (next: typeof globalUser) => setUser(next);
    listeners.add(handler);
    emitListeners();
    return () => {
      listeners.delete(handler);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      await sleep(400);
      if (!cancelled) setReady(true);
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async () => {
    await sleep(600);
    globalUser = {
      id: MOCK_DID,
      smartWallet: {
        address: MOCK_ADDRESS,
        type: 'smart_wallet',
      },
    };
    emitListeners();
    setAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await sleep(200);
    globalUser = null;
    emitListeners();
    setAuthenticated(false);
  }, []);

  const getAccessToken = useCallback(async () => {
    if (!authenticated) return '';
    return 'mock_privy_access_token_' + Date.now();
  }, [authenticated]);

  return {
    ready,
    authenticated,
    login,
    logout,
    user,
    getAccessToken,
  };
}

export function useSmartWallets() {
  const [client, setClient] = useState<SmartWalletClient | undefined>(undefined);

  useEffect(() => {
    const handler = (user: typeof globalUser) => {
      if (user?.smartWallet) {
        setClient({
          address: user.smartWallet.address as `0x${string}`,
          sendTransaction: async (args: { calls: { to: `0x${string}`; data: `0x${string}` }[] }) => {
            await sleep(1200);
            if (Math.random() < 0.15) {
              throw new Error('User rejected the transaction');
            }
            return ('0x' + Math.random().toString(16).slice(2, 66)) as `0x${string}`;
          },
        });
      } else {
        setClient(undefined);
      }
    };
    listeners.add(handler);
    handler(globalUser);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return { client };
}

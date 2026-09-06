'use client';

import { useState, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { useSmartAddress, useSmartWalletClient } from '@/lib/smart-wallet';
import { PRODUCTS, TOKEN_ADDRESS } from '@/lib/tokens';
import SmartAddress from '@/components/SmartAddress';
import { parseTokenAmount, encodeFunctionData } from 'viem';
import { erc20Abi } from '@/lib/abi';
import { usePrivy } from '@/lib/mock-privy';

export default function Home() {
  const smartAddress = useSmartAddress();
  const client = useSmartWalletClient();
  const { ready, authenticated, login } = usePrivy();
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const handleBuy = useCallback(async (productId: string) => {
    if (!client) {
      throw new Error('Smart wallet not connected');
    }

    setPurchasing(true);
    try {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const createRes = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || 'Failed to create order');
      }

      const orderId = createData.orderId;
      const recipient = '0xFaridaWalletAddress0000000000000000000000';

      const transferData = `0xa9059cbb${recipient.slice(2).padStart(64, '0')}${product.priceRaw.toString(16).padStart(64, '0')}`;

      const txHash = await client.sendTransaction({
        calls: [
          {
            to: TOKEN_ADDRESS as `0x${string}`,
            data: transferData as `0x${string}`,
          },
        ],
      });

      setLastOrderId(orderId);

      await fetch(`/api/purchase/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash, status: 'confirmed' }),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (lastOrderId) {
        await fetch(`/api/purchase/${lastOrderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'failed', error: message }),
        });
      }
      throw err;
    } finally {
      setPurchasing(false);
    }
  }, [client, lastOrderId]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Farida&apos;s Shop</h1>
          <p className="text-gray-600 mb-6">Sign in to start shopping with your smart account.</p>
          <button
            onClick={() => login({ loginMethods: ['email'] })}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign in with Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Farida&apos;s Shop</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Smart Account:</span>
            <SmartAddress />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop</h2>
          <p className="text-gray-600">
            Browse products and purchase with a single tap. No gas fees, no top-up required.
          </p>
        </div>

        {!smartAddress ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-yellow-800">
              Please connect your wallet to make a purchase. Your smart account will be created automatically.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800 text-sm">
              Purchases are made via your smart account. A single user operation handles the ERC20 transfer — no separate approval needed because the buyer is transferring their own tokens directly to the seller.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={handleBuy}
              disabled={purchasing || !client}
            />
          ))}
        </div>

        {lastOrderId && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              Order placed! View order: <a href={`/order/${lastOrderId}`} className="underline font-mono">{lastOrderId}</a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';

interface BuyButtonProps {
  product: Product;
  onPurchase: (productId: string) => Promise<void>;
  disabled?: boolean;
}

type OrderState = 'idle' | 'pending' | 'confirmed' | 'failed' | 'rejected';

export default function BuyButton({ product, onPurchase, disabled }: BuyButtonProps) {
  const [orderState, setOrderState] = useState<OrderState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  async function handleBuy() {
    if (disabled) return;
    setOrderState('pending');
    setErrorMessage('');
    setOrderId('');

    try {
      await onPurchase(product.id);
      // onPurchase throws on error; success means it resolved
      setOrderState('confirmed');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorMessage(message);
      setOrderState(err instanceof Error && err.message.includes('Duplicate') ? 'rejected' : 'failed');
    }
  }

  if (orderState === 'confirmed') {
    return (
      <div className="border border-green-500 rounded-lg p-4 bg-green-50">
        <h4 className="text-green-800 font-semibold mb-2">Order Confirmed!</h4>
        <p className="text-sm text-green-700 mb-2">
          You purchased <strong>{product.name}</strong> for {product.priceHuman} {process.env.NEXT_PUBLIC_TOKEN_SYMBOL || 'USDC'}
        </p>
        {orderId && <p className="text-xs text-green-600">Order ID: {orderId}</p>}
      </div>
    );
  }

  if (orderState === 'failed' || orderState === 'rejected') {
    return (
      <div className="border border-red-500 rounded-lg p-4 bg-red-50">
        <h4 className="text-red-800 font-semibold mb-2">Transaction Failed</h4>
        <p className="text-sm text-red-700 mb-3">{errorMessage}</p>
        <button
          onClick={handleBuy}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleBuy}
      disabled={disabled || orderState === 'pending'}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {orderState === 'pending' ? 'Processing...' : `Buy for ${product.priceHuman} ${process.env.NEXT_PUBLIC_TOKEN_SYMBOL || 'USDC'}`}
    </button>
  );
}

'use client';

import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onBuy: (productId: string) => Promise<void>;
  disabled?: boolean;
}

export default function ProductCard({ product, onBuy, disabled }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">
          {product.priceHuman} {process.env.NEXT_PUBLIC_TOKEN_SYMBOL || 'USDC'}
        </span>
      </div>
      <button
        onClick={() => onBuy(product.id)}
        disabled={disabled}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {disabled ? 'Processing...' : 'Buy Now'}
      </button>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { OrderStatusProps } from '@/lib/types';

export default function OrderStatus({ orderId, status, productName, price }: OrderStatusProps) {
  const router = useRouter();

  const statusConfig = {
    pending: { color: 'yellow', label: 'Pending', icon: '⏳' },
    confirmed: { color: 'green', label: 'Confirmed', icon: '✅' },
    failed: { color: 'red', label: 'Failed', icon: '❌' },
    rejected: { color: 'red', label: 'Rejected', icon: '🚫' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Order Status</h1>

        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}>
            <span className="mr-2">{config.icon}</span>
            {config.label}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono text-sm">{orderId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Product</p>
            <p className="font-semibold">{productName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-semibold">{price} {process.env.NEXT_PUBLIC_TOKEN_SYMBOL || 'USDC'}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Shop
          </button>
          {status === 'failed' || status === 'rejected' ? (
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

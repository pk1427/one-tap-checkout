'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import OrderStatus from '@/components/OrderStatus';
import { Order } from '@/lib/types';

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/purchase?orderId=${orderId}`);
        if (!res.ok) {
          throw new Error('Order not found');
        }
        const data: Order = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading order...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Order not found'}</div>
      </div>
    );
  }

  return (
    <OrderStatus
      orderId={order.id}
      status={order.status}
      productName={order.productName}
      price={order.price}
    />
  );
}

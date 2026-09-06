import { NextResponse } from 'next/server';
import { Order } from '@/lib/types';

const orders = new Map<string, Order>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    // Duplicate order check: reject if same product was ordered within last 5 seconds
    const now = Date.now();
    const existingOrder = Array.from(orders.values()).find(
      (o) => o.productId === productId && o.createdAt > now - 5000
    );

    if (existingOrder) {
      return NextResponse.json(
        { error: 'Duplicate order detected', orderId: existingOrder.id },
        { status: 409 }
      );
    }

    const orderId = `order-${now}-${Math.random().toString(36).slice(2, 9)}`;

    const order: Order = {
      id: orderId,
      productId,
      productName: 'Product',
      price: '0.01',
      priceRaw: BigInt(0),
      status: 'pending',
      buyerAddress: '0x0000000000000000000000000000000000000000',
      createdAt: now,
    };

    orders.set(orderId, order);

    return NextResponse.json({ orderId, status: 'pending' }, { status: 201 });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  const order = orders.get(orderId);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const orderId = pathParts[pathParts.length - 1];

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const body = await request.json();
    const order = orders.get(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = { ...order, ...body };
    orders.set(orderId, updatedOrder);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

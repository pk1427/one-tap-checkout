export interface Product {
  id: string;
  name: string;
  description: string;
  priceHuman: string;
  priceRaw: bigint;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  price: string;
  priceRaw: bigint;
  status: 'pending' | 'confirmed' | 'failed' | 'rejected';
  buyerAddress: string;
  createdAt: number;
  txHash?: string;
}

export interface OrderStatusProps {
  orderId: string;
  status: 'pending' | 'confirmed' | 'failed' | 'rejected';
  productName: string;
  price: string;
}

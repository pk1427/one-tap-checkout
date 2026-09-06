import { parseUnits, formatUnits } from 'viem';

export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org';

export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
export const TOKEN_DECIMALS = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '6', 10);
export const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || 'USDC';

export function parseTokenAmount(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals);
}

export function formatTokenAmount(raw: bigint, decimals: number): string {
  return formatUnits(raw, decimals);
}

export const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Hand-Printed Cushion Cover',
    description: 'Beautiful hand-printed cushion cover from Farida',
    priceHuman: '0.01',
    priceRaw: parseTokenAmount('0.01', TOKEN_DECIMALS),
  },
  {
    id: 'prod-2',
    name: 'Set of 3 Coasters',
    description: 'Matching set of 3 hand-printed coasters',
    priceHuman: '0.05',
    priceRaw: parseTokenAmount('0.05', TOKEN_DECIMALS),
  },
  {
    id: 'prod-3',
    name: 'Wall Art Print',
    description: 'Limited edition hand-printed wall art',
    priceHuman: '0.10',
    priceRaw: parseTokenAmount('0.10', TOKEN_DECIMALS),
  },
];

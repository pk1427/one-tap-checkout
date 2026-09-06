# One Tap, No Gas, No Top-Up
**Problem 2 - Road to Devcon III**

A Next.js 14 application demonstrating seamless ERC-20 purchases via smart accounts on Base Sepolia. Buyers enjoy a single-tap experience with zero gas fees and no top-up required.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth & Smart Accounts**: `@privy-io/react-auth` + `@privy-io/react-auth`
- **Blockchain**: Base Sepolia testnet (Chain ID: 84532)
- **Token**: USDC on Base Sepolia (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`, 6 decimals)
- **Utilities**: viem, permissionless

## Smart Account Implementation

- **Provider**: Privy Smart Wallets (`SmartWalletsProvider`)
- **Configuration**: `createOnLogin: true` — smart account is created automatically when the user logs in
- **Chain**: Base Sepolia (84532)
- **Client**: Purchases are sent through the smart account client (`useSmartWallets` client), NOT the embedded EOA wallet
- **Address Display**: All addresses shown to the buyer resolve to the smart account address

## Gas Sponsorship

Gas fees are sponsored via Privy's embedded paymaster configuration. The buyer does not need any native ETH balance. The smart account submits the user operation and the paymaster covers the gas cost.

## Single Tap Purchase Flow

1. User connects wallet (email, social, or external wallet)
2. Privy creates an embedded EOA and an ERC-4337 smart account on Base Sepolia
3. User clicks "Buy" once on a product
4. The app creates an order record server-side
5. The smart account sends a single ERC-20 `transfer` call via `client.sendTransaction({ calls: [...] })`
6. A direct ERC20 transfer needs only one call — no approval is required because the buyer is transferring their own tokens directly to the seller
7. The paymaster sponsors the gas
8. On success, the order is confirmed and the buyer sees a success state
9. On failure, the buyer sees a clear error message with a retry option

## Order States

- `pending`: Order created, transaction pending
- `confirmed`: Transaction confirmed on-chain
- `failed`: Transaction reverted or encountered an error
- `rejected`: User rejected the transaction in their wallet

## Order Deduplication

Orders are deduplicated server-side. A second invocation for the same product within a short time window is rejected with a `409 Conflict` response. The UI only allows one purchase at a time via the disabled state, but the server is the source of truth.

## Decimals Helper

Token amounts are converted using `parseUnits` from viem with the token's `decimals` property. No float arithmetic or string concatenation is used.

```typescript
import { parseUnits, formatUnits } from 'viem';

export function parseTokenAmount(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals);
}

export function formatTokenAmount(raw: bigint, decimals: number): string {
  return formatUnits(raw, decimals);
}
```

## Setup Instructions

1. **Clone and install dependencies**:
   ```bash
   cd one-tap-checkout
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in your Privy credentials:
   ```bash
   cp .env.example .env
   ```
   
   Get your Privy App ID from [https://dashboard.privy.io](https://dashboard.privy.io).

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Your Privy App ID (required) |
| `PRIVY_APP_SECRET` | Privy App Secret for server-side operations |
| `NEXT_PUBLIC_BASE_RPC_URL` | Base Sepolia RPC endpoint |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | ERC-20 token contract address on Base Sepolia |
| `NEXT_PUBLIC_TOKEN_DECIMALS` | Token decimals (e.g., 6 for USDC) |
| `NEXT_PUBLIC_TOKEN_SYMBOL` | Token symbol for display |
| `NEXT_PUBLIC_PAYMASTER_URL` | Optional: Custom paymaster URL for gas sponsorship |

## Testnet Details

- **Network**: Base Sepolia
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org
- **Token**: USDC on Base Sepolia
  - Address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
  - Decimals: 6

## File Structure

```
app/
  layout.tsx          - PrivyProvider + SmartWalletsProvider
  page.tsx            - Shop/catalog view
  order/[id]/page.tsx - Order status page
  api/purchase/route.ts - Purchase endpoint
components/
  ProductCard.tsx
  BuyButton.tsx
  OrderStatus.tsx
  SmartAddress.tsx
lib/
  tokens.ts           - Token config, decimals helper
  smart-wallet.ts     - Smart wallet utilities
  types.ts            - TypeScript interfaces
  abi.ts              - Minimal ERC20 ABI
  utils.ts            - Utility functions
```

## Security

- All secrets are stored in `.env` (gitignored)
- Server tracks orders for deduplication
- No credentials are committed to the repository

## License

MIT

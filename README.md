# Crypto Portfolio Trading with x402

A web application that allows users and AI agents to purchase crypto portfolio allocation strategies using the x402 payment protocol on Base network.

## Features

- **Three Portfolio Strategies:**
  - **Passive Yield**: Deploy USDC to over-collateralized lending markets on Base (Low Risk)
  - **Investooor**: Deploy USDC into COIN50 index for diversified exposure (Medium Risk)
  - **Degen Mode**: Deploy USDC into top 5 trending tokens on Base with >$100M FDV (High Risk)

- **x402 Payment Protocol**: Seamless micropayments ($0.01 USDC per strategy)
- **Smart Wallet Integration**: Automatic wallet creation using Base Account
- **Copy Trading**: Purchase strategies to unlock full portfolio allocations

## Architecture

### Backend (Node.js + Express + TypeScript)
- x402 seller middleware for protecting premium endpoints
- REST API for strategy browsing and wallet management
- Payment verification and settlement
- Smart wallet creation using Coinbase SDK

### Frontend (React + Vite + TypeScript)
- Strategy marketplace UI
- x402 buyer client for automatic payment handling
- Responsive design with modern styling
- Real-time payment flow

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd x402
```

2. Install dependencies:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

3. Configure environment variables:
```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers:
```bash
# From root directory
npm run dev

# Or separately:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

5. Open your browser to `http://localhost:3000`

## Usage

1. **Create a Wallet**: Click "Create Smart Wallet" to generate a Base smart wallet
2. **Browse Strategies**: View the three available portfolio strategies
3. **Purchase Strategy**: Click "Purchase Strategy" to buy access for $0.01 USDC
4. **View Allocation**: After payment, the full portfolio allocation is revealed
5. **Copy Trading**: Use the allocation details to deploy your capital

## x402 Payment Flow

1. User requests protected strategy endpoint
2. Server responds with `402 Payment Required` + payment requirements
3. Frontend x402 client creates payment payload
4. Payment is verified (via Coinbase facilitator in production)
5. Server returns full strategy details
6. User can view and copy the portfolio allocation

## Project Structure

```
x402/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── strategies.ts       # Strategy definitions
│   │   ├── middleware/
│   │   │   └── x402.ts             # x402 payment middleware
│   │   ├── routes/
│   │   │   ├── strategies.ts       # Strategy endpoints
│   │   │   └── wallet.ts           # Wallet management
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   └── index.ts                # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StrategyCard.tsx    # Strategy display
│   │   │   └── WalletConnect.tsx   # Wallet UI
│   │   ├── services/
│   │   │   ├── api.ts              # API client
│   │   │   └── x402Client.ts       # x402 payment client
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   ├── package.json
│   └── vite.config.ts
└── package.json
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/strategies` - List all strategies (preview only)
- `POST /api/wallet/create` - Create smart wallet

### Protected Endpoints (x402 Required)
- `GET /api/strategies/:id/full` - Get full strategy details ($0.01 USDC)

## Configuration

### Backend Environment Variables
```bash
PORT=3001
RECEIVER_ADDRESS=0xYourEthereumAddress
COINBASE_API_KEY_NAME=your_api_key_name        # Optional
COINBASE_API_KEY_PRIVATE_KEY=your_private_key  # Optional
NODE_ENV=development
```

### Frontend Configuration
The frontend proxies API requests to the backend via Vite's proxy configuration.

## Development Notes

### Demo Mode
The application includes a demo mode that:
- Creates mock wallets if Coinbase SDK is not configured
- Simulates payment transactions for testing
- Works without real USDC or blockchain transactions

### Production Deployment
For production use:
1. Configure Coinbase SDK credentials
2. Set up real payment verification with Coinbase facilitator
3. Implement on-chain transaction verification
4. Add proper database for wallet and payment storage
5. Enable HTTPS/SSL
6. Configure CORS properly

## Technologies Used

- **Backend**: Express.js, TypeScript, Coinbase SDK
- **Frontend**: React, Vite, TypeScript
- **Payment Protocol**: x402 (HTTP 402 Payment Required)
- **Blockchain**: Base Network (Ethereum L2)
- **Assets**: USDC stablecoin

## License

MIT

## Learn More

- [x402 Protocol Docs](https://docs.cdp.coinbase.com/x402/welcome)
- [Coinbase Developer Platform](https://www.coinbase.com/developer-platform)
- [Base Network](https://base.org)

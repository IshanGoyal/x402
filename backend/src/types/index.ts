export interface PortfolioStrategy {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  price: string; // in USDC
  allocation: TokenAllocation[];
  rebalancingFrequency: string;
  expectedAPY: string;
  minInvestment: string;
}

export interface TokenAllocation {
  symbol: string;
  percentage: number;
  address?: string;
  protocol?: string;
}

export interface PaymentRequirement {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  payTo: string;
  asset: string;
  maxTimeoutSeconds: number;
}

export interface PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: any;
}

export interface StrategyPurchase {
  strategyId: string;
  userAddress: string;
  txHash: string;
  timestamp: number;
}

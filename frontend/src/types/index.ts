export interface PortfolioStrategy {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  price: string;
  allocation?: TokenAllocation[];
  rebalancingFrequency: string;
  expectedAPY: string;
  minInvestment: string;
  allocationSummary?: string;
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

export interface WalletInfo {
  address: string;
  walletId: string;
  network?: string;
  isDemoWallet?: boolean;
}

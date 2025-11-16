import { PortfolioStrategy } from '../types';

export const strategies: PortfolioStrategy[] = [
  {
    id: 'passive-yield',
    name: 'Passive Yield',
    description: 'Deploy USDC to over-collateralized lending markets on Base for steady, low-risk returns',
    category: 'DeFi Lending',
    riskLevel: 'low',
    price: '0.01', // $0.01 USDC
    allocation: [
      {
        symbol: 'USDC',
        percentage: 100,
        protocol: 'Aave v3',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
      }
    ],
    expectedAPY: '4-8%',
    minInvestment: '$1 USDC'
  },
  {
    id: 'investooor',
    name: 'Investooor',
    description: 'Deploy USDC into COIN50 index - a diversified portfolio of the top 50 crypto assets',
    category: 'Index Fund',
    riskLevel: 'medium',
    price: '0.01', // $0.01 USDC
    allocation: [
      {
        symbol: 'BTC',
        percentage: 30,
        address: '0x...' // cbBTC on Base
      },
      {
        symbol: 'ETH',
        percentage: 25,
        address: '0x4200000000000000000000000000000000000006' // WETH on Base
      },
      {
        symbol: 'SOL',
        percentage: 10,
        address: '0x...'
      },
      {
        symbol: 'Top 47 Coins',
        percentage: 35,
        address: 'Various'
      }
    ],
    expectedAPY: '15-40%',
    minInvestment: '$1 USDC'
  },
  {
    id: 'degen-mode',
    name: 'Degen Mode',
    description: 'Deploy USDC into the top 5 trending tokens on Base with >$100M fully diluted market cap. High risk, high reward.',
    category: 'Trending Tokens',
    riskLevel: 'high',
    price: '0.01', // $0.01 USDC
    allocation: [
      {
        symbol: 'VIRTUAL',
        percentage: 25,
        address: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b'
      },
      {
        symbol: 'AERO',
        percentage: 20,
        address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631'
      },
      {
        symbol: 'BRETT',
        percentage: 20,
        address: '0x532f27101965dd16442E59d40670FaF5eBB142E4'
      },
      {
        symbol: 'DEGEN',
        percentage: 20,
        address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed'
      },
      {
        symbol: 'TOSHI',
        percentage: 15,
        address: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4'
      }
    ],
    expectedAPY: '50-200% (or -90%)',
    minInvestment: '$1 USDC'
  }
];

export const getStrategyById = (id: string): PortfolioStrategy | undefined => {
  return strategies.find(s => s.id === id);
};

export const getAllStrategies = (): PortfolioStrategy[] => {
  return strategies;
};

// Public preview without full allocation details
export const getStrategyPreview = (strategy: PortfolioStrategy) => {
  return {
    id: strategy.id,
    name: strategy.name,
    description: strategy.description,
    category: strategy.category,
    riskLevel: strategy.riskLevel,
    price: strategy.price,
    expectedAPY: strategy.expectedAPY,
    minInvestment: strategy.minInvestment,
    // Don't include full allocation details
    allocationSummary: `${strategy.allocation.length} token${strategy.allocation.length > 1 ? 's' : ''}`
  };
};

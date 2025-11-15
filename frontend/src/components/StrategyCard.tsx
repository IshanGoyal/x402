import React from 'react';
import { PortfolioStrategy, TokenAllocation } from '../types';

interface StrategyCardProps {
  strategy: PortfolioStrategy;
  onPurchase: (strategyId: string) => void;
  isPurchased: boolean;
  isLoading: boolean;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onPurchase,
  isPurchased,
  isLoading
}) => {
  const riskColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
  };

  const renderAllocation = (allocation: TokenAllocation[]) => {
    return (
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ margin: '8px 0', fontSize: '14px', fontWeight: 600 }}>
          Portfolio Allocation:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {allocation.map((token, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                backgroundColor: '#f9fafb',
                borderRadius: '4px',
                fontSize: '13px'
              }}
            >
              <div>
                <strong>{token.symbol}</strong>
                {token.protocol && (
                  <span style={{ color: '#6b7280', marginLeft: '8px' }}>
                    ({token.protocol})
                  </span>
                )}
              </div>
              <span style={{ fontWeight: 600, color: '#059669' }}>
                {token.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700 }}>
            {strategy.name}
          </h3>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: `${riskColors[strategy.riskLevel]}20`,
              color: riskColors[strategy.riskLevel]
            }}
          >
            {strategy.riskLevel.toUpperCase()} RISK
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#059669' }}>
            ${strategy.price}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>USDC</div>
        </div>
      </div>

      <p style={{ margin: '16px 0', color: '#4b5563', lineHeight: '1.6' }}>
        {strategy.description}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          margin: '16px 0',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Expected APY
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#059669' }}>
            {strategy.expectedAPY}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Min. Investment
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>
            {strategy.minInvestment}
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Rebalancing
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>
            {strategy.rebalancingFrequency}
          </div>
        </div>
      </div>

      {isPurchased && strategy.allocation && renderAllocation(strategy.allocation)}

      {!isPurchased && (
        <button
          onClick={() => onPurchase(strategy.id)}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '16px',
            backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }
          }}
        >
          {isLoading ? 'Processing Payment...' : `Purchase Strategy - $${strategy.price} USDC`}
        </button>
      )}

      {isPurchased && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          ✓ Strategy Purchased - Ready to Deploy
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { WalletInfo } from '../types';

interface WalletConnectProps {
  wallet: WalletInfo | null;
  onConnect: () => void;
  isLoading: boolean;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnect,
  isLoading
}) => {
  if (wallet) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px'
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22c55e'
          }}
        />
        <div>
          <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
            Connected Wallet
          </div>
          <div style={{ fontSize: '14px', color: '#15803d', fontFamily: 'monospace' }}>
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </div>
        </div>
        {wallet.isDemoWallet && (
          <div
            style={{
              marginLeft: 'auto',
              fontSize: '11px',
              padding: '4px 8px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              borderRadius: '4px',
              fontWeight: 600
            }}
          >
            DEMO MODE
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isLoading}
      style={{
        padding: '12px 24px',
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
      {isLoading ? 'Creating Wallet...' : 'Create Smart Wallet'}
    </button>
  );
};

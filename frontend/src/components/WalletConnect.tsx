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
          backgroundColor: '#0052FF',
          border: '2px solid #0052FF',
          borderRadius: '10px'
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#00ff00'
          }}
        />
        <div>
          <div style={{ fontSize: '11px', color: '#ffffff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            connected
          </div>
          <div style={{ fontSize: '13px', color: '#ffffff', fontFamily: 'monospace', fontWeight: 700 }}>
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </div>
        </div>
        {wallet.isDemoWallet && (
          <div
            style={{
              marginLeft: 'auto',
              fontSize: '10px',
              padding: '4px 10px',
              backgroundColor: '#ffffff',
              color: '#000000',
              borderRadius: '6px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            demo
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
        padding: '12px 28px',
        backgroundColor: isLoading ? '#6b7280' : '#0052FF',
        color: '#ffffff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: 700,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        textTransform: 'lowercase',
        letterSpacing: '-0.01em'
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.backgroundColor = '#0041cc';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading) {
          e.currentTarget.style.backgroundColor = '#0052FF';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {isLoading ? 'creating wallet...' : 'create smart wallet'}
    </button>
  );
};

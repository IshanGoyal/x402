import React, { useState, useEffect } from 'react';
import { PortfolioStrategy, WalletInfo } from './types';
import { api } from './services/api';
import { x402Client } from './services/x402Client';
import { StrategyCard } from './components/StrategyCard';
import { WalletConnect } from './components/WalletConnect';

function App() {
  const [strategies, setStrategies] = useState<PortfolioStrategy[]>([]);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [purchasedStrategies, setPurchasedStrategies] = useState<Set<string>>(new Set());
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const userId = 'demo-user-' + Math.random().toString(36).slice(2, 9);

  // Update timestamp every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const data = await api.getStrategies();
      setStrategies(data);
    } catch (err) {
      setError('Failed to load strategies');
      console.error(err);
    }
  };

  const handleCreateWallet = async () => {
    setLoadingWallet(true);
    setError(null);

    try {
      const walletInfo = await api.createWallet(userId);
      console.log('Wallet created:', walletInfo);
      setWallet(walletInfo);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create wallet';
      setError(errorMsg);
      console.error('Wallet creation error:', err);
    } finally {
      setLoadingWallet(false);
    }
  };

  const handlePurchaseStrategy = async (strategyId: string) => {
    if (!wallet) {
      setError('Please create a wallet first');
      return;
    }

    setLoadingStrategy(strategyId);
    setError(null);

    try {
      // Use x402 client to fetch with payment
      const result = await x402Client.fetchWithPayment<{
        strategy: PortfolioStrategy;
        message: string;
      }>(`/api/strategies/${strategyId}/full`, wallet.address);

      // Update the strategy with full details
      setStrategies((prev) =>
        prev.map((s) => (s.id === strategyId ? result.strategy : s))
      );

      // Mark as purchased
      setPurchasedStrategies((prev) => new Set([...prev, strategyId]));

      // Show success message
      alert(`${result.message}\n\nYou can now view the full portfolio allocation!`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed');
      console.error(err);
    } finally {
      setLoadingStrategy(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#000000',
          borderBottom: '2px solid #0052FF',
          padding: '24px 0'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              crypto portfolio strategies
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#0052FF', fontSize: '14px', fontWeight: 600 }}>
              powered by x402 on base
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#9ca3af' }}>
              <div style={{ fontWeight: 500, color: '#e5e7eb' }}>Last Updated</div>
              <div style={{ fontWeight: 700, color: '#0052FF', fontFamily: 'monospace', fontSize: '12px' }}>
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            </div>
            <WalletConnect
              wallet={wallet}
              onConnect={handleCreateWallet}
              isLoading={loadingWallet}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', backgroundColor: '#f8f9fa' }}>
        {error && (
          <div
            style={{
              padding: '16px 20px',
              marginBottom: '24px',
              backgroundColor: '#000000',
              color: '#ffffff',
              borderRadius: '12px',
              border: '2px solid #0052FF',
              fontWeight: 600
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', color: '#000000', letterSpacing: '-0.02em' }}>
            browse strategies
          </h2>
          <p style={{ color: '#4b5563', fontSize: '16px', fontWeight: 500 }}>
            each strategy costs $0.01 USDC • purchase to unlock full portfolio allocations
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}
        >
          {strategies.map((strategy) => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              onPurchase={handlePurchaseStrategy}
              isPurchased={purchasedStrategies.has(strategy.id)}
              isLoading={loadingStrategy === strategy.id}
            />
          ))}
        </div>

        {strategies.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '48px',
              color: '#6b7280'
            }}
          >
            Loading strategies...
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: '80px',
          padding: '40px 24px',
          backgroundColor: '#000000',
          borderTop: '2px solid #0052FF',
          textAlign: 'center',
          color: '#ffffff',
          fontSize: '14px'
        }}
      >
        <p style={{ fontWeight: 600, fontSize: '15px' }}>
          built with x402 protocol • base network • smart wallets
        </p>
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#9ca3af' }}>
          demo application for educational purposes
        </p>
      </footer>
    </div>
  );
}

export default App;

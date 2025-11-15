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

  const userId = 'demo-user-' + Math.random().toString(36).slice(2, 9);

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 0'
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
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#111827' }}>
              Crypto Portfolio Strategies
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Powered by x402 Payment Protocol on Base
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#9ca3af' }}>
              Last Updated<br />
              <span style={{ fontWeight: 600, color: '#6b7280' }}>Nov 15, 2025 23:50 UTC</span>
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
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {error && (
          <div
            style={{
              padding: '16px',
              marginBottom: '24px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            Browse Strategies
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Each strategy costs $0.01 USDC. Purchase to unlock full portfolio allocations.
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
          padding: '32px 24px',
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px'
        }}
      >
        <p>
          Built with x402 protocol • Base Network • Smart Wallets
        </p>
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          Demo application for educational purposes
        </p>
      </footer>
    </div>
  );
}

export default App;

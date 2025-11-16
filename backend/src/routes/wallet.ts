import express from 'express';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';

const router = express.Router();

// In-memory wallet store (in production, use a database with encryption)
const userWallets = new Map<string, { address: string; walletId: string }>();

// Create a smart wallet for a user
router.post('/create', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Check if user already has a wallet
    if (userWallets.has(userId)) {
      const existingWallet = userWallets.get(userId);
      return res.json({
        address: existingWallet?.address,
        walletId: existingWallet?.walletId,
        message: 'Wallet already exists'
      });
    }

    // Initialize Coinbase SDK
    const apiKeyName = process.env.COINBASE_API_KEY_NAME;
    const privateKey = process.env.COINBASE_API_KEY_PRIVATE_KEY;

    if (!apiKeyName || !privateKey) {
      // No credentials - create demo wallet
      const mockAddress = `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`;

      userWallets.set(userId, {
        address: mockAddress,
        walletId: `demo-${userId}`
      });

      return res.json({
        address: mockAddress,
        walletId: `demo-${userId}`,
        network: 'base-mainnet',
        message: 'Demo wallet created (configure Coinbase API for production)',
        isDemoWallet: true
      });
    }

    Coinbase.configure({
      apiKeyName,
      privateKey
    });

    // Create wallet on Base network
    const wallet = await Wallet.create({ networkId: 'base-mainnet' });
    const address = await wallet.getDefaultAddress();

    // Store wallet info
    userWallets.set(userId, {
      address: address.getId(),
      walletId: wallet.getId()
    });

    res.json({
      address: address.getId(),
      walletId: wallet.getId(),
      network: 'base-mainnet',
      message: 'Smart wallet created successfully'
    });

  } catch (error: any) {
    console.error('Wallet creation error:', error);

    // For demo purposes, return a mock wallet if Coinbase SDK fails
    const mockAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
    const { userId } = req.body;

    userWallets.set(userId, {
      address: mockAddress,
      walletId: `demo-${userId}`
    });

    res.json({
      address: mockAddress,
      walletId: `demo-${userId}`,
      network: 'base-mainnet',
      message: 'Demo wallet created (configure Coinbase API for production)',
      isDemoWallet: true
    });
  }
});

// Get wallet info
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const wallet = userWallets.get(userId);

  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  res.json(wallet);
});

export default router;

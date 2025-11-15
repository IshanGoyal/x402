import express from 'express';
import { getAllStrategies, getStrategyById, getStrategyPreview } from '../data/strategies';

const router = express.Router();

// Public endpoint - browse all strategies (preview only)
router.get('/', (req, res) => {
  const strategies = getAllStrategies();
  const previews = strategies.map(getStrategyPreview);
  res.json({ strategies: previews });
});

// Protected endpoint - get full strategy details (requires x402 payment)
// The x402 middleware is applied in index.ts
router.get('/:id/full', (req, res) => {
  const { id } = req.params;
  const strategy = getStrategyById(id);

  if (!strategy) {
    return res.status(404).json({ error: 'Strategy not found' });
  }

  // Return full strategy with allocation details
  res.json({
    strategy,
    message: 'Payment verified! You now have access to this strategy.',
    purchasedAt: new Date().toISOString()
  });
});

export default router;

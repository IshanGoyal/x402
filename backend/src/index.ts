import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import strategiesRouter from './routes/strategies';
import walletRouter from './routes/wallet';
import { x402Middleware } from './middleware/x402';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS || '0x0000000000000000000000000000000000000000';

// Middleware
app.use(cors());
app.use(express.json());

// Apply x402 payment middleware
app.use(x402Middleware({
  receiverAddress: RECEIVER_ADDRESS,
  priceMap: {
    '/api/strategies/passive-yield/full': '0.01',
    '/api/strategies/investooor/full': '0.01',
    '/api/strategies/degen-mode/full': '0.01'
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Crypto Portfolio x402 API',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/strategies', strategiesRouter);
app.use('/api/wallet', walletRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💰 Receiver address: ${RECEIVER_ADDRESS}`);
  console.log(`📊 x402 payment protocol enabled`);
});

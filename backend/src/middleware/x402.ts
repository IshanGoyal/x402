import { Request, Response, NextFunction } from 'express';
import { PaymentRequirement, PaymentPayload } from '../types';

interface X402Config {
  receiverAddress: string;
  priceMap: { [endpoint: string]: string };
}

// In-memory store for verified payments (in production, use a database)
const verifiedPayments = new Set<string>();

export const x402Middleware = (config: X402Config) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Check if this endpoint requires payment
    const price = config.priceMap[req.path];

    if (!price) {
      // No payment required for this endpoint
      return next();
    }

    // Check for payment header
    const paymentHeader = req.headers['x-payment'];

    if (!paymentHeader) {
      // No payment provided, return 402 Payment Required
      const paymentRequirement: PaymentRequirement = {
        scheme: 'coinbase-facilitator',
        network: 'base',
        maxAmountRequired: price,
        payTo: config.receiverAddress,
        asset: 'USDC',
        maxTimeoutSeconds: 300
      };

      return res.status(402).json({
        error: 'Payment Required',
        paymentRequirements: [paymentRequirement]
      });
    }

    // Verify payment
    try {
      const paymentData = typeof paymentHeader === 'string'
        ? JSON.parse(Buffer.from(paymentHeader, 'base64').toString('utf-8'))
        : paymentHeader;

      const verified = await verifyPayment(paymentData, config.receiverAddress, price);

      if (!verified) {
        return res.status(402).json({
          error: 'Payment verification failed'
        });
      }

      // Payment verified, attach to request and continue
      (req as any).payment = paymentData;

      // Add payment response header
      res.setHeader('X-PAYMENT-RESPONSE', JSON.stringify({
        verified: true,
        timestamp: Date.now()
      }));

      next();
    } catch (error) {
      console.error('Payment verification error:', error);
      return res.status(402).json({
        error: 'Invalid payment format'
      });
    }
  };
};

async function verifyPayment(
  payment: PaymentPayload,
  expectedReceiver: string,
  expectedAmount: string
): Promise<boolean> {
  // Basic validation
  if (payment.x402Version !== 1) {
    return false;
  }

  if (payment.scheme !== 'coinbase-facilitator') {
    return false;
  }

  if (payment.network !== 'base') {
    return false;
  }

  // In a real implementation, you would:
  // 1. Verify the payment with Coinbase facilitator
  // 2. Check the transaction on-chain
  // 3. Ensure amount matches expected price
  // 4. Verify receiver address

  // For demo purposes, we'll do basic payload validation
  const { payload } = payment;

  if (!payload || !payload.txHash) {
    // For now, we'll accept any payment with a valid structure
    // In production, verify with facilitator and on-chain
    console.log('Payment received:', payment);

    // Generate a unique payment ID
    const paymentId = `${payment.network}-${payload.txHash || Date.now()}`;

    // Check if already used
    if (verifiedPayments.has(paymentId)) {
      return false;
    }

    // Mark as verified
    verifiedPayments.add(paymentId);
    return true;
  }

  return true;
}

import axios, { AxiosError } from 'axios';
import { PaymentRequirement, PaymentPayload } from '../types';

export class X402Client {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  async fetchWithPayment<T>(
    endpoint: string,
    walletAddress: string
  ): Promise<T> {
    try {
      // First attempt - no payment
      const response = await axios.get(`${this.baseURL}${endpoint}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      // Check if it's a 402 Payment Required
      if (axiosError.response?.status === 402) {
        const paymentData = axiosError.response.data as any;
        const requirements = paymentData.paymentRequirements as PaymentRequirement[];

        if (requirements && requirements.length > 0) {
          // Create payment payload
          const payment = await this.createPayment(requirements[0], walletAddress);

          // Retry with payment
          const paidResponse = await axios.get(`${this.baseURL}${endpoint}`, {
            headers: {
              'X-PAYMENT': this.encodePayment(payment)
            }
          });

          return paidResponse.data;
        }
      }

      throw error;
    }
  }

  private async createPayment(
    requirement: PaymentRequirement,
    walletAddress: string
  ): Promise<PaymentPayload> {
    // In a real implementation, this would:
    // 1. Connect to user's wallet
    // 2. Create and sign a transaction
    // 3. Submit to Coinbase facilitator
    // 4. Wait for confirmation
    // 5. Return the payment proof

    // For demo purposes, we create a mock payment
    const mockTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

    return {
      x402Version: 1,
      scheme: requirement.scheme,
      network: requirement.network,
      payload: {
        from: walletAddress,
        to: requirement.payTo,
        amount: requirement.maxAmountRequired,
        asset: requirement.asset,
        txHash: mockTxHash,
        timestamp: Date.now()
      }
    };
  }

  private encodePayment(payment: PaymentPayload): string {
    const json = JSON.stringify(payment);
    return Buffer.from(json).toString('base64');
  }
}

export const x402Client = new X402Client();

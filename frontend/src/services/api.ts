import axios from 'axios';
import { PortfolioStrategy, WalletInfo } from '../types';

const API_URL = '/api';

export const api = {
  // Get all strategies (preview)
  getStrategies: async (): Promise<PortfolioStrategy[]> => {
    const response = await axios.get(`${API_URL}/strategies`);
    return response.data.strategies;
  },

  // Create wallet for user
  createWallet: async (userId: string): Promise<WalletInfo> => {
    const response = await axios.post(`${API_URL}/wallet/create`, { userId });
    return response.data;
  },

  // Get wallet info
  getWallet: async (userId: string): Promise<WalletInfo> => {
    const response = await axios.get(`${API_URL}/wallet/${userId}`);
    return response.data;
  }
};

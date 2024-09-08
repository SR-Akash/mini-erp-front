// src/features/purchase/services/PurchaseService.ts

import axios from 'axios';
import { Purchase } from '../../../models/Purchase';

// Function to fetch purchase data from the API
export const fetchPurchases = async (accountId: number): Promise<Purchase[]> => {
  const response = await axios.get(`api/Purchase/GetPurchaseReceivedList?accountId=${accountId}`);
  return response.data;
};

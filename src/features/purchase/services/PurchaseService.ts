// src/features/purchase/services/PurchaseService.ts

import axios from 'axios';
import { Purchase } from '../../../models/Purchase';

// Function to fetch purchase data from the API
export const fetchPurchases = async (accountId: number): Promise<Purchase[]> => {
  const response = await axios.get(`api/Purchase/GetPurchaseReceivedList?accountId=${accountId}`);
  return response.data;
};

export const createPurchaseReceive = async (payload: any) => {
  try {
    const response = await axios.post(
      "api/Purchase/CreatePurchaseReceive",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error while creating purchase receive:", error);
    throw error;
  }
};
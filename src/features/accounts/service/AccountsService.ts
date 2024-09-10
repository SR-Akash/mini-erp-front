import axios from "axios";
import { Account, CreateJournalVoucherPayload } from "../interfaces/Accounts";

export const getChartOfAccounts = async (accountId: number, searchValue?: string): Promise<Account[]> => {
  let url = `/api/Accounts/GetChartofAccList?accountId=${accountId}`;
  if (searchValue) {
    url += `&search=${encodeURIComponent(searchValue)}`;
  }

  const response = await axios.get(url);
  return response.data;
};

export const fetchTemplateData = async (accountId: number) => {
  try {
    const response = await axios.get(`/api/Accounts/GetChartofAccListTemplate?accountId=${accountId}`);
    return response.data; // Adjust based on your actual response format
  } catch (error) {
    console.error("Error fetching template data:", error);
    throw error;
  }
};

export const saveTemplateData = async (templateData: any[]) => {
  try {
    const response = await axios.post(`/api/Accounts/CreateChartofAccTemplate`, templateData);
    return response.data;
  } catch (error) {
    console.error("Error saving template data:", error);
    throw error;
  }
};


// API call to create a new Chart of Account
export const createChartOfAccount = async (payload: any) => {
  try {
    const response = await axios.post("/api/Accounts/CreateChartofAcc", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating Chart of Account:", error);
    throw error;
  }
};

// API call to create a new journal voucher
export const createJournalVoucher = async (payload: CreateJournalVoucherPayload) => {
  try {
    const response = await axios.post("/api/Accounts/CreateJournalVoucher", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating journal voucher:", error);
    throw error;
  }
};

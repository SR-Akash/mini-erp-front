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


export const fetchCategoryList = async (accountId: number) => {
  try {
    const response = await axios.get(`/api/Accounts/GetChartOfAccCategoryList?accountId=${accountId}`);
    return response.data; // Adjust based on your actual response format
  } catch (error) {
    console.error("Error fetching category list:", error);
    throw error;
  }
};

// API call to create a new journal voucher
export const createJournalVoucher = async (payload: any) => {
  try {
    const response = await axios.post("/api/Accounts/CreateJournalVoucher", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating journal voucher:", error);
    throw error;
  }
};

export const updateChartOfAccount = async (payload: any) => {
  try {
    const response = await axios.post("/api/Accounts/UpdateChartofAcc", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating Chart of Account:", error);
    throw error;
  }
};


export const getJournalVoucherLandingData = async (
  accountId: number,
  fromDate?: string,
  toDate?: string,
  search?: string,
  viewOrder: string = "desc",
  pageNo: number = 1,
  pageSize: number = 15
) => {
  const url = `/api/Accounts/GetJournalVoucherLandingPagination?accountId=${accountId}&viewOrder=${viewOrder}&pageNo=${pageNo}&pageSize=${pageSize}`;

  let queryString = url;
  if (fromDate) queryString += `&fromDate=${fromDate}`;
  if (toDate) queryString += `&toDate=${toDate}`;
  if (search) queryString += `&search=${encodeURIComponent(search)}`;

  const response = await axios.get(queryString);
  return response.data;
};

export const getJournalVoucherById = async (journalId: number) => {
  const url = `/api/Accounts/GetJournalVoucherById?journalId=${journalId}`;
  const response = await axios.get(url);
  return response.data; // Ensure the API response is returned properly
};

export const saveJournalVoucher = async (payload: any) => {
  const response = await axios.post("/api/Accounts/SaveJournalVoucher", payload); // Adjust the API endpoint if needed
  return response.data;
};

export const getPartners = async (accountId: any, partnerTypeId: any) => {
  try {
    const response = await axios.get(`/api/Configuration/GetPartnerList?accountId=${accountId}&partnerTypeId=${partnerTypeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Partners:", error);
    throw error;
  }
};


// Fetch Bank Accounts when templateId = 2
export const getBankAccounts = async (accountId: number, branchId: number = 0) => {
  try {
    const response = await axios.get(`/api/Accounts/GetBankAccountList?accountId=${accountId}&branchId=${branchId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Bank Accounts:", error);
    throw error;
  }
};


 

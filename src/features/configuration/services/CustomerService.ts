import axios from 'axios';
import { Customer } from 'models/Customer';

// Fetch customers from the API
// Fetch suppliers
export const getCustomers = async (accountId: number): Promise<Customer[]> => {
    const response = await axios.get(`api/Configuration/GetPartnerList?accountId=${accountId}&partnerTypeId=1`);
    return response.data;
  };
   

export const createCustomer = async (supplierData: Partial<Customer>): Promise<Customer> => {
    const response = await axios.post('api/Configuration/CreatePartner', supplierData);
    return response.data;
  };

import axios from 'axios';
import { Supplier } from 'models/Supplier';
 

// Fetch suppliers
export const getSuppliers = async (accountId: number): Promise<Supplier[]> => {
  const response = await axios.get(`api/Configuration/GetPartnerList?accountId=${accountId}&partnerTypeId=2`);
  return response.data;
};
 
// Create supplier
export const createSupplier = async (supplierData: Partial<Supplier>): Promise<Supplier> => {
  const response = await axios.post('api/Configuration/CreatePartner', supplierData);
  return response.data;
};

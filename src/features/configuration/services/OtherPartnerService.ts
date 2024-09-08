
import axios from 'axios';
import { OtherPartner } from 'models/OtherPartner';
 
// Fetch suppliers
export const getOtherPartners = async (accountId: number): Promise<OtherPartner[]> => {
    const response = await axios.get(`api/Configuration/GetPartnerList?accountId=${accountId}&partnerTypeId=3`);
    return response.data;
  };
   
  // Create supplier
  export const createOtherPartner = async (supplierData: Partial<OtherPartner>): Promise<OtherPartner> => {
    const response = await axios.post('api/Configuration/CreatePartner', supplierData);
    return response.data;
  };
  
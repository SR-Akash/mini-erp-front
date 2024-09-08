import axios from 'axios';
import { Item } from '../../../models/Item';

const API_URL = 'https://localhost:44337/api/Configuration/GetItemList';

export const getItems = async (accountId: number): Promise<Item[]> => {
  const response = await axios.get(`${API_URL}?accountId=${accountId}`);
  return response.data;
};


export const createItem = async (itemData: Partial<Item>): Promise<Item> => {
  const response = await axios.post('https://localhost:44337/api/Configuration/CreateItem', itemData); // Replace with your actual endpoint
  return response.data;
};
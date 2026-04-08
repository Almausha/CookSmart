import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchShoppingList = (userId: string) =>
  API.get(`/shopping-list/${userId}`);

export const addToShoppingList = (userId: string, ingredients: any[]) =>
  API.post('/shopping-list/add', { userId, ingredients });

export const togglePurchased = (userId: string, ingredientId: string) =>
  API.put('/shopping-list/toggle', { userId, ingredientId });

export const removeItem = (userId: string, ingredientId: string) =>
  API.delete(`/shopping-list/item/${ingredientId}`, { data: { userId } });

export const clearShoppingList = (userId: string) =>
  API.delete(`/shopping-list/clear/${userId}`);

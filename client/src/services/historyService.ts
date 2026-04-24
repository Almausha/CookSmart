import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const saveToHistory = (userId: string, recipeId: string) =>
  API.post('/history', { userId, recipeId });

export const fetchHistory = (userId: string) =>
  API.get(`/history/${userId}`);

export const deleteHistoryItem = (historyId: string) =>
  API.delete(`/history/${historyId}`);

import axios from 'axios';
const BASE = '/api/pantry';
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getPantryItems    = ()           => api.get(BASE);
export const createPantryItem  = (pantrydata)       => api.post(BASE, pantrydata);
export const updatePantryItem  = (userId, pantrydata)   => api.put(`${BASE}/${userId}`, pantrydata);
export const deletePantryItem  = (userId)         => api.delete(`${BASE}/${userId}`);
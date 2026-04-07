import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchReviews = (recipeId: string) => API.get(`/reviews/${recipeId}`);

export const addReview = (recipeId: string, userId: string, rating: number, comment: string) =>
  API.post(`/reviews/${recipeId}`, { userId, rating, comment });

export const deleteReview = (reviewId: string, userId: string) =>
  API.delete(`/reviews/${reviewId}`, { data: { userId } });

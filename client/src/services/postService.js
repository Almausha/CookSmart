import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchPosts = () => API.get('/posts');
export const createPost = (postData) => API.post('/posts', postData);
export const toggleLike = (postId, userId) => API.put(`/posts/${postId}/like`, { userId });
export const addComment = (postId, userId, username, text) =>
  API.post(`/posts/${postId}/comment`, { userId, username, text });
export const sharePost = (postId) => API.put(`/posts/${postId}/share`);
export const deletePost = (postId, userId) =>
  API.delete(`/posts/${postId}`, { data: { userId } });

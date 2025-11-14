import axios from 'axios';

// Get the backend API URL from Vite's environment variables
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: VITE_API_BASE_URL || 'http://localhost:5000/api',
});

const user  =  localStorage.getItem('user'); 
if (user){
api.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(user).token}`; 
}

// We will add an interceptor here later to automatically add the
// auth token to every request.

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL||'/api', // Relative path for proxying requests
});

export default api;

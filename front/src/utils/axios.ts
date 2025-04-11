import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // обнови при необходимости
  withCredentials: true, // если будешь использовать httpOnly cookies
});

export default api;

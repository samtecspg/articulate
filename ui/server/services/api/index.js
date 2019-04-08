import axios from 'axios';
import { API_URL } from '../../../common/env';

const api = axios.create({
  baseURL: API_URL
});
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

export default api;

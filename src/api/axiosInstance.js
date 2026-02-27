import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const makeRequest = async (method, url, data = null, config = {}) => {
  const response = await axiosInstance({ method, url, data, ...config });
  return response.data;
};

export const get = (url, config = {}) => makeRequest('get', url, null, config);

export const post = (url, data, config = {}) => makeRequest('post', url, data, config);

export const put = (url, data, config = {}) => makeRequest('put', url, data, config);

export const patch = (url, data, config = {}) => makeRequest('patch', url, data, config);

export const del = (url, config = {}) => makeRequest('delete', url, null, config);

export default axiosInstance;

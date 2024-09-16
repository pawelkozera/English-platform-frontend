import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await apiClient.post('/api/v1/auth/refreshToken');

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");
        localStorage.removeItem("groups");
        console.error('Failed to refresh token', refreshError);
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken"); 

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      const isValidToken = checkTokenValidity(accessToken);
      if (isValidToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      } else {
        localStorage.removeItem("accessToken");
      }
    }

    return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

const checkTokenValidity = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp < Date.now() / 1000;
    return !isExpired;
  } catch (e) {
    return false;
  }
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await apiClient.post('/refresh-token', { refreshToken });
        accessToken = response.data.accessToken;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);
        // TODO: redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

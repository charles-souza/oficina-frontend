import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Não fazer logout se for erro de senha incorreta no endpoint de alteração de senha
      const isPasswordChangeEndpoint = error.config?.url?.includes('/perfil/senha');

      if (!isPasswordChangeEndpoint) {
        // Token inválido ou expirado - fazer logout
        localStorage.removeItem('token');
        localStorage.removeItem('oficinaId');
        localStorage.removeItem('roles');
        window.location.href = '/login';
      }
      // Se for endpoint de senha, apenas rejeita o erro sem fazer logout
    }
    return Promise.reject(error);
  }
);

export default api;
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

      // Endpoints que podem retornar 401 sem ser token expirado
      const isAuthErrorEndpoint = isPasswordChangeEndpoint;

      if (!isAuthErrorEndpoint) {
        // Token inválido ou expirado - fazer logout
        console.log('401 Unauthorized: Token expirado ou inválido, fazendo logout...');
        localStorage.removeItem('token');
        localStorage.removeItem('oficinaId');
        localStorage.removeItem('roles');
        window.location.href = '/login';
      } else {
        // Erro de autenticação esperado (senha incorreta), não fazer logout
        console.log('401 em endpoint protegido:', error.config?.url);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
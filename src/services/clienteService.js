import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { ERROR_MESSAGES } from '../constants';

export const clienteService = {
  getAll: async (page = 0, size = 10, filters = {}) => {
    return withErrorHandling(
      async () => {
        const params = { page, size, ...filters };
        const response = await api.get('/clientes', { params });
        return response.data;
      },
      ERROR_MESSAGES.LOAD_CLIENTS
    );
  },

  getById: async (id) => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/clientes/${id}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_CLIENTS
    );
  },

  getByName: async (nome) => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/clientes/nome/${encodeURIComponent(nome)}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_CLIENTS
    );
  },

  create: async (cliente) => {
    return withErrorHandling(
      async () => {
        const response = await api.post('/clientes', cliente);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_CLIENT
    );
  },

  update: async (id, cliente) => {
    return withErrorHandling(
      async () => {
        const response = await api.put(`/clientes/${id}`, cliente);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_CLIENT
    );
  },

  delete: async (id) => {
    return withErrorHandling(
      async () => {
        await api.delete(`/clientes/${id}`);
      },
      ERROR_MESSAGES.DELETE_CLIENT
    );
  }
};

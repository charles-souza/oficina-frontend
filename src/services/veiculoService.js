import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { ERROR_MESSAGES } from '../constants';

export const veiculoService = {
  getAll: async (page = 0, size = 10) => {
    return withErrorHandling(
      async () => {
        const response = await api.get('/veiculos', { params: { page, size } });
        return response.data;
      },
      ERROR_MESSAGES.LOAD_VEHICLES
    );
  },

  getById: async (id) => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/veiculos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_VEHICLES
    );
  },

  create: async (veiculo) => {
    return withErrorHandling(
      async () => {
        const response = await api.post('/veiculos', veiculo);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_VEHICLE
    );
  },

  update: async (id, veiculo) => {
    return withErrorHandling(
      async () => {
        const response = await api.put(`/veiculos/${id}`, veiculo);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_VEHICLE
    );
  },

  delete: async (id) => {
    return withErrorHandling(
      async () => {
        await api.delete(`/veiculos/${id}`);
      },
      ERROR_MESSAGES.DELETE_VEHICLE
    );
  }
};

import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { ERROR_MESSAGES } from '../constants';
import { Veiculo, PaginatedResponse } from '../types';

export const veiculoService = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Veiculo> | Veiculo[]> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<PaginatedResponse<Veiculo> | Veiculo[]>('/veiculos', { params: { page, size } });
        return response.data;
      },
      ERROR_MESSAGES.LOAD_VEHICLES
    );
  },

  getById: async (id: number): Promise<Veiculo> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Veiculo>(`/veiculos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_VEHICLES
    );
  },

  create: async (veiculo: Omit<Veiculo, 'id'>): Promise<Veiculo> => {
    return withErrorHandling(
      async () => {
        const response = await api.post<Veiculo>('/veiculos', veiculo);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_VEHICLE
    );
  },

  update: async (id: number, veiculo: Partial<Veiculo>): Promise<Veiculo> => {
    return withErrorHandling(
      async () => {
        const response = await api.put<Veiculo>(`/veiculos/${id}`, veiculo);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_VEHICLE
    );
  },

  delete: async (id: number): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/veiculos/${id}`);
      },
      ERROR_MESSAGES.DELETE_VEHICLE
    );
  }
};

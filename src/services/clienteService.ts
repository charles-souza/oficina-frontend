import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { ERROR_MESSAGES } from '../constants';
import { Cliente, PaginatedResponse } from '../types';

interface ClienteFilters {
  [key: string]: string | number | undefined;
}

export const clienteService = {
  getAll: async (page = 0, size = 10, filters: ClienteFilters = {}): Promise<PaginatedResponse<Cliente>> => {
    return withErrorHandling(
      async () => {
        const params = { page, size, ...filters };
        const response = await api.get<PaginatedResponse<Cliente>>('/clientes', { params });
        return response.data;
      },
      ERROR_MESSAGES.LOAD_CLIENTS
    );
  },

  getById: async (id: number): Promise<Cliente> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Cliente>(`/clientes/${id}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_CLIENTS
    );
  },

  getByName: async (nome: string): Promise<Cliente[]> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Cliente[]>(`/clientes/nome/${encodeURIComponent(nome)}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_CLIENTS
    );
  },

  create: async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
    return withErrorHandling(
      async () => {
        const response = await api.post<Cliente>('/clientes', cliente);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_CLIENT
    );
  },

  update: async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    return withErrorHandling(
      async () => {
        const response = await api.put<Cliente>(`/clientes/${id}`, cliente);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_CLIENT
    );
  },

  delete: async (id: number): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/clientes/${id}`);
      },
      ERROR_MESSAGES.DELETE_CLIENT
    );
  }
};

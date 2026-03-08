import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { removeUndefinedFields } from '../utils/objectUtils';
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

  /**
   * Busca um cliente por ID (UUID)
   * @param id - ID do cliente (UUID)
   */
  getById: async (id: string): Promise<Cliente> => {
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
        const cleanedCliente = removeUndefinedFields(cliente);
        const response = await api.post<Cliente>('/clientes', cleanedCliente);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_CLIENT
    );
  },

  /**
   * Atualiza um cliente existente
   * @param id - ID do cliente (UUID)
   */
  update: async (id: string, cliente: Partial<Cliente>): Promise<Cliente> => {
    try {
      console.log('clienteService.update - Iniciando atualização:', { id, cliente });
      const cleanedCliente = removeUndefinedFields(cliente);
      const response = await api.put<Cliente>(`/clientes/${id}`, cleanedCliente);
      console.log('clienteService.update - Resposta do backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('clienteService.update - ERRO:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        error
      });
      throw error;
    }
  },

  /**
   * Deleta um cliente (soft delete)
   * @param id - ID do cliente (UUID)
   */
  delete: async (id: string): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/clientes/${id}`);
      },
      ERROR_MESSAGES.DELETE_CLIENT
    );
  }
};

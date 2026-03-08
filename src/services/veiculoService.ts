import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { removeUndefinedFields } from '../utils/objectUtils';
import { ERROR_MESSAGES } from '../constants';
import { Veiculo, PaginatedResponse } from '../types';

interface VeiculoFilters {
  [key: string]: string | number | undefined;
}

export const veiculoService = {
  /**
   * Lista todos os veículos
   */
  getAll: async (page = 0, size = 10, filters: VeiculoFilters = {}): Promise<PaginatedResponse<Veiculo>> => {
    return withErrorHandling(
      async () => {
        const params = { page, size, ...filters };
        const response = await api.get<PaginatedResponse<Veiculo> | Veiculo[]>('/veiculos', { params });

        // Backend retorna array diretamente, não objeto paginado
        if (Array.isArray(response.data)) {
          return {
            content: response.data,
            totalElements: response.data.length,
            totalPages: Math.ceil(response.data.length / size),
            size: size,
            number: page,
          };
        }

        // Se vier objeto paginado (compatibilidade futura)
        return response.data;
      },
      ERROR_MESSAGES.LOAD_VEHICLES
    );
  },

  /**
   * Busca um veículo por ID (UUID)
   * @param id - ID do veículo (UUID)
   */
  getById: async (id: string): Promise<Veiculo> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Veiculo>(`/veiculos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_VEHICLES
    );
  },

  /**
   * Cria um novo veículo
   * IMPORTANTE: ano deve ser number, clienteId deve ser string (UUID)
   * @param veiculo - Dados do veículo (sem ID)
   */
  create: async (veiculo: Omit<Veiculo, 'id' | 'clienteNome'>): Promise<Veiculo> => {
    return withErrorHandling(
      async () => {
        const cleanedVeiculo = removeUndefinedFields(veiculo);
        const response = await api.post<Veiculo>('/veiculos', cleanedVeiculo);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_VEHICLE
    );
  },

  /**
   * Atualiza um veículo existente
   * @param id - ID do veículo (UUID)
   * @param veiculo - Dados do veículo a serem atualizados
   */
  update: async (id: string, veiculo: Omit<Veiculo, 'id' | 'clienteNome'>): Promise<Veiculo> => {
    try {
      console.log('veiculoService.update - Iniciando atualização:', { id, veiculo });
      const cleanedVeiculo = removeUndefinedFields(veiculo);
      const response = await api.put<Veiculo>(`/veiculos/${id}`, cleanedVeiculo);
      console.log('veiculoService.update - Resposta do backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('veiculoService.update - ERRO:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        error
      });
      throw error;
    }
  },

  /**
   * Deleta um veículo (soft delete)
   * @param id - ID do veículo (UUID)
   */
  delete: async (id: string): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/veiculos/${id}`);
      },
      ERROR_MESSAGES.DELETE_VEHICLE
    );
  }
};

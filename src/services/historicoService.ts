import api from './api';
import { HistoricoServico, PaginatedResponse } from '../types/api';

const BASE_URL = '/historico';

export const historicoService = {
  /**
   * Buscar todo o histórico com paginação
   */
  getAll: async (
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<HistoricoServico>> => {
    const response = await api.get<PaginatedResponse<HistoricoServico> | HistoricoServico[]>(BASE_URL, {
      params: { page, size },
    });

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

  /**
   * Buscar histórico por veículo
   */
  getByVeiculo: async (veiculoId: number): Promise<HistoricoServico[]> => {
    const response = await api.get<HistoricoServico[]>(
      `${BASE_URL}/veiculo/${veiculoId}`
    );
    return response.data;
  },

  /**
   * Buscar histórico por ordem de serviço
   */
  getByOrdemServico: async (ordemServicoId: number): Promise<HistoricoServico[]> => {
    const response = await api.get<HistoricoServico[]>(
      `${BASE_URL}/ordem-servico/${ordemServicoId}`
    );
    return response.data;
  },

  /**
   * Buscar histórico por ID
   */
  getById: async (id: number): Promise<HistoricoServico> => {
    const response = await api.get<HistoricoServico>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Buscar histórico recente (últimos N registros)
   */
  getRecent: async (limit: number = 10): Promise<HistoricoServico[]> => {
    const response = await api.get<HistoricoServico[]>(`${BASE_URL}/recent`, {
      params: { limit },
    });
    return response.data;
  },
};

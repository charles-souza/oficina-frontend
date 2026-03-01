import api from './api';
import {
  OrdemServico,
  OrdemServicoRequest,
  OrdemServicoStatus,
  PaginatedResponse,
} from '../types/api';

const BASE_URL = '/ordens-servico';

export const ordemServicoService = {
  /**
   * Buscar todas as ordens de serviço com paginação
   */
  getAll: async (
    page: number = 0,
    size: number = 10,
    status?: OrdemServicoStatus
  ): Promise<PaginatedResponse<OrdemServico>> => {
    const params: Record<string, string | number> = {
      page,
      size,
    };

    if (status) {
      params.status = status;
    }

    const response = await api.get<PaginatedResponse<OrdemServico> | OrdemServico[]>(BASE_URL, {
      params,
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
   * Buscar ordem de serviço por ID
   */
  getById: async (id: number): Promise<OrdemServico> => {
    const response = await api.get<OrdemServico>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Criar nova ordem de serviço
   */
  create: async (ordem: OrdemServicoRequest): Promise<OrdemServico> => {
    const response = await api.post<OrdemServico>(BASE_URL, ordem);
    return response.data;
  },

  /**
   * Atualizar ordem de serviço existente
   */
  update: async (id: number, ordem: OrdemServicoRequest): Promise<OrdemServico> => {
    const response = await api.put<OrdemServico>(`${BASE_URL}/${id}`, ordem);
    return response.data;
  },

  /**
   * Deletar ordem de serviço (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Atualizar status da ordem de serviço
   */
  updateStatus: async (
    id: number,
    status: OrdemServicoStatus
  ): Promise<OrdemServico> => {
    const response = await api.patch<OrdemServico>(
      `${BASE_URL}/${id}/status`,
      null,
      {
        params: { status },
      }
    );
    return response.data;
  },

  /**
   * Criar ordem de serviço a partir de orçamento aprovado
   */
  createFromOrcamento: async (orcamentoId: number): Promise<OrdemServico> => {
    const response = await api.post<OrdemServico>(
      `${BASE_URL}/from-orcamento/${orcamentoId}`
    );
    return response.data;
  },

  /**
   * Buscar ordens de serviço por cliente
   */
  getByCliente: async (clienteId: number): Promise<OrdemServico[]> => {
    const response = await api.get<OrdemServico[]>(`${BASE_URL}/cliente/${clienteId}`);
    return response.data;
  },

  /**
   * Buscar ordens de serviço por veículo
   */
  getByVeiculo: async (veiculoId: number): Promise<OrdemServico[]> => {
    const response = await api.get<OrdemServico[]>(`${BASE_URL}/veiculo/${veiculoId}`);
    return response.data;
  },

  /**
   * Buscar ordens de serviço abertas hoje
   */
  getAbertasHoje: async (): Promise<OrdemServico[]> => {
    const response = await api.get<OrdemServico[]>(`${BASE_URL}/abertas-hoje`);
    return response.data;
  },
};

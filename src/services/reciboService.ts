import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { Recibo, PaginatedResponse } from '../types';

const ERROR_MESSAGES_RECIBOS = {
  LOAD: 'Erro ao carregar recibos.',
  SAVE: 'Erro ao salvar recibo.',
  DELETE: 'Erro ao excluir recibo.',
};

export const reciboService = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Recibo> | Recibo[]> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<PaginatedResponse<Recibo> | Recibo[]>('/recibos', { params: { page, size } });
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.LOAD
    );
  },

  getById: async (id: number): Promise<Recibo> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Recibo>(`/recibos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.LOAD
    );
  },

  getByOrcamentoId: async (orcamentoId: number): Promise<Recibo[]> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Recibo[]>(`/recibos/orcamento/${orcamentoId}`);
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.LOAD
    );
  },

  create: async (recibo: Omit<Recibo, 'id'>): Promise<Recibo> => {
    return withErrorHandling(
      async () => {
        const response = await api.post<Recibo>('/recibos', recibo);
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.SAVE
    );
  },

  /**
   * Criar recibo a partir de Ordem de Serviço pronta
   */
  createFromOrdemServico: async (
    ordemServicoId: string | number,
    formaPagamento: string,
    observacoes?: string
  ): Promise<Recibo> => {
    return withErrorHandling(
      async () => {
        const response = await api.post<Recibo>(
          `/recibos/from-ordem-servico/${ordemServicoId}`,
          {
            formaPagamento,
            observacoes
          }
        );
        return response.data;
      },
      'Erro ao gerar recibo. Verifique se a ordem está com status PRONTA.'
    );
  },

  update: async (id: number, recibo: Partial<Recibo>): Promise<Recibo> => {
    return withErrorHandling(
      async () => {
        const response = await api.put<Recibo>(`/recibos/${id}`, recibo);
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.SAVE
    );
  },

  delete: async (id: number): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/recibos/${id}`);
      },
      ERROR_MESSAGES_RECIBOS.DELETE
    );
  },

  /**
   * Gera o PDF do recibo
   */
  gerarPdf: async (id: string | number): Promise<Blob> => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/recibos/${id}/pdf`, {
          responseType: 'blob',
        });
        return response.data;
      },
      'Erro ao gerar PDF do recibo.'
    );
  }
};

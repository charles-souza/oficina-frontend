import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { Servico, PaginatedResponse } from '../types';

const ERROR_MESSAGES_SERVICOS = {
  LOAD: 'Erro ao carregar serviços.',
  SAVE: 'Erro ao salvar serviço.',
  DELETE: 'Erro ao excluir serviço.',
};

export const servicoService = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Servico> | Servico[]> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<PaginatedResponse<Servico> | Servico[]>('/servicos', { params: { page, size } });
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.LOAD
    );
  },

  getById: async (id: number): Promise<Servico> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Servico>(`/servicos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.LOAD
    );
  },

  create: async (servico: Omit<Servico, 'id'>): Promise<Servico> => {
    return withErrorHandling(
      async () => {
        const response = await api.post<Servico>('/servicos', servico);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.SAVE
    );
  },

  update: async (id: number, servico: Partial<Servico>): Promise<Servico> => {
    return withErrorHandling(
      async () => {
        const response = await api.put<Servico>(`/servicos/${id}`, servico);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.SAVE
    );
  },

  delete: async (id: number): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/servicos/${id}`);
      },
      ERROR_MESSAGES_SERVICOS.DELETE
    );
  }
};

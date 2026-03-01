import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { ERROR_MESSAGES } from '../constants';
import { Orcamento } from '../types';

export const orcamentoService = {
  getAll: async (): Promise<Orcamento[]> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Orcamento[]>('/orcamentos');
        return response.data;
      },
      ERROR_MESSAGES.LOAD_QUOTES
    );
  },

  getById: async (id: number): Promise<Orcamento> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Orcamento>(`/orcamentos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_QUOTES
    );
  },

  create: async (orcamento: Omit<Orcamento, 'id'>): Promise<Orcamento> => {
    return withErrorHandling(
      async () => {
        const response = await api.post<Orcamento>('/orcamentos', orcamento);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_QUOTE
    );
  },

  update: async (id: number, orcamento: Partial<Orcamento>): Promise<Orcamento> => {
    return withErrorHandling(
      async () => {
        const response = await api.put<Orcamento>(`/orcamentos/${id}`, orcamento);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_QUOTE
    );
  },

  updateStatus: async (id: number, status: string): Promise<Orcamento> => {
    return withErrorHandling(
      async () => {
        const response = await api.patch<Orcamento>(`/orcamentos/${id}/status`, null, { params: { status } });
        return response.data;
      },
      ERROR_MESSAGES.UPDATE_STATUS
    );
  },

  generatePdf: async (id: number): Promise<Blob> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Blob>(`/orcamentos/${id}/pdf`);
        return response.data;
      },
      'Erro ao gerar PDF'
    );
  },

  delete: async (id: number): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/orcamentos/${id}`);
      },
      ERROR_MESSAGES.DELETE_QUOTE
    );
  }
};

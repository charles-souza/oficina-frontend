import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { ERROR_MESSAGES } from '../constants';

export const orcamentoService = {
  getAll: async () => {
    return withErrorHandling(
      async () => {
        const response = await api.get('/orcamentos');
        return response.data;
      },
      ERROR_MESSAGES.LOAD_QUOTES
    );
  },

  getById: async (id) => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/orcamentos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES.LOAD_QUOTES
    );
  },

  create: async (orcamento) => {
    return withErrorHandling(
      async () => {
        const response = await api.post('/orcamentos', orcamento);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_QUOTE
    );
  },

  update: async (id, orcamento) => {
    return withErrorHandling(
      async () => {
        const response = await api.put(`/orcamentos/${id}`, orcamento);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_QUOTE
    );
  },

  updateStatus: async (id, status) => {
    return withErrorHandling(
      async () => {
        const response = await api.patch(`/orcamentos/${id}/status`, null, { params: { status } });
        return response.data;
      },
      ERROR_MESSAGES.UPDATE_STATUS
    );
  },

  generatePdf: async (id) => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/orcamentos/${id}/pdf`);
        return response.data;
      },
      'Erro ao gerar PDF'
    );
  },

  delete: async (id) => {
    return withErrorHandling(
      async () => {
        await api.delete(`/orcamentos/${id}`);
      },
      ERROR_MESSAGES.DELETE_QUOTE
    );
  }
};

import api from './api';
import { withErrorHandling } from '../utils/errorHandler';

const ERROR_MESSAGES_RECIBOS = {
  LOAD: 'Erro ao carregar recibos.',
  SAVE: 'Erro ao salvar recibo.',
  DELETE: 'Erro ao excluir recibo.',
};

export const reciboService = {
  getAll: async (page = 0, size = 10) => {
    return withErrorHandling(
      async () => {
        const response = await api.get('/recibos', { params: { page, size } });
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.LOAD
    );
  },

  getById: async (id) => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/recibos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.LOAD
    );
  },

  getByOrcamentoId: async (orcamentoId) => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/recibos/orcamento/${orcamentoId}`);
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.LOAD
    );
  },

  create: async (recibo) => {
    return withErrorHandling(
      async () => {
        const response = await api.post('/recibos', recibo);
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.SAVE
    );
  },

  update: async (id, recibo) => {
    return withErrorHandling(
      async () => {
        const response = await api.put(`/recibos/${id}`, recibo);
        return response.data;
      },
      ERROR_MESSAGES_RECIBOS.SAVE
    );
  },

  delete: async (id) => {
    return withErrorHandling(
      async () => {
        await api.delete(`/recibos/${id}`);
      },
      ERROR_MESSAGES_RECIBOS.DELETE
    );
  }
};

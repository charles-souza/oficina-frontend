import api from './api';
import { withErrorHandling } from '../utils/errorHandler';

const ERROR_MESSAGES_SERVICOS = {
  LOAD: 'Erro ao carregar serviços.',
  SAVE: 'Erro ao salvar serviço.',
  DELETE: 'Erro ao excluir serviço.',
};

export const servicoService = {
  getAll: async (page = 0, size = 10) => {
    return withErrorHandling(
      async () => {
        const response = await api.get('/servicos', { params: { page, size } });
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.LOAD
    );
  },

  getById: async (id) => {
    return withErrorHandling(
      async () => {
        const response = await api.get(`/servicos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.LOAD
    );
  },

  create: async (servico) => {
    return withErrorHandling(
      async () => {
        const response = await api.post('/servicos', servico);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.SAVE
    );
  },

  update: async (id, servico) => {
    return withErrorHandling(
      async () => {
        const response = await api.put(`/servicos/${id}`, servico);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.SAVE
    );
  },

  delete: async (id) => {
    return withErrorHandling(
      async () => {
        await api.delete(`/servicos/${id}`);
      },
      ERROR_MESSAGES_SERVICOS.DELETE
    );
  }
};

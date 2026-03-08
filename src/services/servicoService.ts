import api from './api';
import { withErrorHandling } from '../utils/errorHandler';
import { removeUndefinedFields } from '../utils/objectUtils';
import { Servico } from '../types';

const ERROR_MESSAGES_SERVICOS = {
  LOAD: 'Erro ao carregar serviços.',
  SAVE: 'Erro ao salvar serviço.',
  DELETE: 'Erro ao excluir serviço.',
  ACTIVATE: 'Erro ao ativar serviço.',
  DEACTIVATE: 'Erro ao desativar serviço.',
  LOAD_CATEGORIES: 'Erro ao carregar categorias.',
};

export interface ServicoFilters {
  ativo?: boolean;
  categoria?: string;
  search?: string;
}

export const servicoService = {
  /**
   * Lista todos os serviços com filtros opcionais
   * @param filters - Filtros para busca (ativo, categoria, search)
   */
  getAll: async (filters?: ServicoFilters): Promise<Servico[]> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Servico[]>('/servicos', { params: filters });
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.LOAD
    );
  },

  /**
   * Busca um serviço por ID
   * @param id - ID do serviço (UUID)
   */
  getById: async (id: string): Promise<Servico> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Servico>(`/servicos/${id}`);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.LOAD
    );
  },

  /**
   * Lista todas as categorias distintas de serviços
   */
  getCategories: async (): Promise<string[]> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<string[]>('/servicos/categorias');
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.LOAD_CATEGORIES
    );
  },

  /**
   * Cria um novo serviço
   * @param servico - Dados do serviço (sem ID)
   */
  create: async (servico: Omit<Servico, 'id'>): Promise<Servico> => {
    return withErrorHandling(
      async () => {
        const cleanedServico = removeUndefinedFields(servico);
        const response = await api.post<Servico>('/servicos', cleanedServico);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.SAVE
    );
  },

  /**
   * Atualiza um serviço existente
   * @param id - ID do serviço (UUID)
   * @param servico - Dados do serviço a serem atualizados
   */
  update: async (id: string, servico: Omit<Servico, 'id'>): Promise<Servico> => {
    return withErrorHandling(
      async () => {
        const cleanedServico = removeUndefinedFields(servico);
        const response = await api.put<Servico>(`/servicos/${id}`, cleanedServico);
        return response.data;
      },
      ERROR_MESSAGES_SERVICOS.SAVE
    );
  },

  /**
   * Ativa um serviço
   * @param id - ID do serviço (UUID)
   */
  activate: async (id: string): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.patch(`/servicos/${id}/ativar`);
      },
      ERROR_MESSAGES_SERVICOS.ACTIVATE
    );
  },

  /**
   * Desativa um serviço
   * @param id - ID do serviço (UUID)
   */
  deactivate: async (id: string): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.patch(`/servicos/${id}/desativar`);
      },
      ERROR_MESSAGES_SERVICOS.DEACTIVATE
    );
  },

  /**
   * Deleta um serviço (soft delete)
   * @param id - ID do serviço (UUID)
   */
  delete: async (id: string): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/servicos/${id}`);
      },
      ERROR_MESSAGES_SERVICOS.DELETE
    );
  }
};

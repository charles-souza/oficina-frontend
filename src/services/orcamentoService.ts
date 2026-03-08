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

  getById: async (id: string | number): Promise<Orcamento> => {
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
        console.log('orcamentoService.create - Payload completo:', JSON.stringify(orcamento, null, 2));

        // Limpar campos que são apenas para exibição
        const { clienteNome, veiculoPlaca, veiculoModelo, ...cleanOrcamento } = orcamento;

        // Remover IDs dos itens (novos itens não devem ter ID)
        if (cleanOrcamento.itens && Array.isArray(cleanOrcamento.itens)) {
          cleanOrcamento.itens = cleanOrcamento.itens.map(({ id: itemId, ...item }) => item);
        }

        // Adicionar dataOrcamento como fallback (compatibilidade com backend)
        if (cleanOrcamento.dataEmissao && !cleanOrcamento.dataOrcamento) {
          cleanOrcamento.dataOrcamento = cleanOrcamento.dataEmissao;
        }

        // Garantir que datas estejam no formato ISO (YYYY-MM-DD)
        if (cleanOrcamento.dataEmissao) {
          cleanOrcamento.dataEmissao = cleanOrcamento.dataEmissao.split('T')[0];
        }
        if (cleanOrcamento.dataValidade) {
          cleanOrcamento.dataValidade = cleanOrcamento.dataValidade.split('T')[0];
        }
        if (cleanOrcamento.dataOrcamento) {
          cleanOrcamento.dataOrcamento = cleanOrcamento.dataOrcamento.split('T')[0];
        }

        console.log('orcamentoService.create - Payload limpo (sem IDs dos itens):', JSON.stringify(cleanOrcamento, null, 2));

        const response = await api.post<Orcamento>('/orcamentos', cleanOrcamento);
        return response.data;
      },
      ERROR_MESSAGES.SAVE_QUOTE
    );
  },

  update: async (id: string | number, orcamento: Partial<Orcamento>): Promise<Orcamento> => {
    try {
      console.log('orcamentoService.update - ID:', id);
      console.log('orcamentoService.update - Payload completo:', JSON.stringify(orcamento, null, 2));

      // Limpar campos que são apenas para exibição e que não devem ser enviados
      const { id: _, clienteNome, veiculoPlaca, veiculoModelo, ...cleanOrcamento } = orcamento;

      // Criar uma nova lista mutável de itens (importante para Hibernate)
      if (cleanOrcamento.itens && Array.isArray(cleanOrcamento.itens)) {
        cleanOrcamento.itens = cleanOrcamento.itens.map(item => ({
          id: item.id,
          tipo: item.tipo,
          descricao: item.descricao,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          valorTotal: item.valorTotal
        }));
      }

      // Adicionar dataOrcamento como fallback (compatibilidade com backend)
      if (cleanOrcamento.dataEmissao && !cleanOrcamento.dataOrcamento) {
        cleanOrcamento.dataOrcamento = cleanOrcamento.dataEmissao;
      }

      // Garantir que datas estejam no formato ISO (YYYY-MM-DD)
      if (cleanOrcamento.dataEmissao) {
        cleanOrcamento.dataEmissao = cleanOrcamento.dataEmissao.split('T')[0];
      }
      if (cleanOrcamento.dataValidade) {
        cleanOrcamento.dataValidade = cleanOrcamento.dataValidade.split('T')[0];
      }
      if (cleanOrcamento.dataOrcamento) {
        cleanOrcamento.dataOrcamento = cleanOrcamento.dataOrcamento.split('T')[0];
      }

      console.log('orcamentoService.update - Payload limpo:', JSON.stringify(cleanOrcamento, null, 2));

      const response = await api.put<Orcamento>(`/orcamentos/${id}`, cleanOrcamento);
      return response.data;
    } catch (error: any) {
      console.error('Erro detalhado do backend:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Erro completo:', error);
      throw error;
    }
  },

  updateStatus: async (id: string | number, status: string): Promise<Orcamento> => {
    return withErrorHandling(
      async () => {
        const response = await api.patch<Orcamento>(`/orcamentos/${id}/status`, null, { params: { status } });
        return response.data;
      },
      ERROR_MESSAGES.UPDATE_STATUS
    );
  },

  generatePdf: async (id: string | number): Promise<Blob> => {
    return withErrorHandling(
      async () => {
        const response = await api.get<Blob>(`/orcamentos/${id}/pdf`);
        return response.data;
      },
      'Erro ao gerar PDF'
    );
  },

  delete: async (id: string | number): Promise<void> => {
    return withErrorHandling(
      async () => {
        await api.delete(`/orcamentos/${id}`);
      },
      ERROR_MESSAGES.DELETE_QUOTE
    );
  }
};

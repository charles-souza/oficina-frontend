import api from './api';
import { HistoricoServico } from '../types/api';

const BASE_URL = '/historico';

export const historicoService = {
  /**
   * Buscar histórico por veículo
   * Endpoint: GET /api/historico/veiculo/{veiculoId}
   */
  getByVeiculo: async (veiculoId: number): Promise<HistoricoServico[]> => {
    const response = await api.get<HistoricoServico[]>(
      `${BASE_URL}/veiculo/${veiculoId}`
    );
    return response.data;
  },
};

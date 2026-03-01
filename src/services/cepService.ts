import axios, { AxiosError } from 'axios';

const VIA_CEP_BASE = 'https://viacep.com.br/ws';

interface CepResponse {
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

interface AddressData {
  rua: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export const cepService = {
  async getAddressByCep(cep: string, signal: AbortSignal | null = null): Promise<AddressData> {
    if (!cep) throw new Error('CEP é obrigatório');
    const cleaned = String(cep).replace(/\D/g, '');
    if (cleaned.length !== 8) throw new Error('CEP inválido');

    try {
      const response = await axios.get<CepResponse>(`${VIA_CEP_BASE}/${cleaned}/json/`, {
        signal: signal || undefined,
      });
      const data = response.data;
      if (!data) throw new Error('Resposta vazia da API ViaCep');
      if (data.erro) throw new Error('CEP não encontrado');

      return {
        rua: data.logradouro || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      };
    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 400) {
        throw new Error('CEP inválido');
      }
      throw err;
    }
  },
};

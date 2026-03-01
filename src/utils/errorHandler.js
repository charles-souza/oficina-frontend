import { ERROR_MESSAGES } from '../constants';

/**
 * Extrai mensagem de erro de uma resposta da API
 * @param {Error} error - Erro capturado
 * @param {string} defaultMessage - Mensagem padrão se não conseguir extrair
 * @returns {string} Mensagem de erro formatada
 */
export const extractErrorMessage = (error, defaultMessage = ERROR_MESSAGES.GENERIC) => {
  // Erro de rede
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK;
  }

  // Resposta da API com mensagem customizada
  if (error.response.data) {
    const { data } = error.response;

    // Padrão 1: { message: "..." }
    if (data.message) {
      return data.message;
    }

    // Padrão 2: { error: "..." }
    if (data.error) {
      return data.error;
    }

    // Padrão 3: { errors: [...] } (validação)
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map(e => e.message || e).join(', ');
    }

    // Padrão 4: String direto
    if (typeof data === 'string') {
      return data;
    }
  }

  // Mensagens padrão por status HTTP
  switch (error.response.status) {
    case 400:
      return 'Requisição inválida. Verifique os dados enviados.';
    case 401:
      return 'Não autorizado. Faça login novamente.';
    case 403:
      return 'Acesso negado. Você não tem permissão.';
    case 404:
      return 'Recurso não encontrado.';
    case 409:
      return 'Conflito. O recurso já existe.';
    case 422:
      return 'Dados inválidos. Verifique os campos.';
    case 500:
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    case 503:
      return 'Serviço temporariamente indisponível.';
    default:
      return defaultMessage;
  }
};

/**
 * Wrapper para chamadas de API com tratamento de erro consistente
 * @param {Function} apiCall - Função async que faz a chamada
 * @param {string} defaultErrorMessage - Mensagem padrão de erro
 * @returns {Promise} Resultado da chamada ou erro tratado
 */
export const withErrorHandling = async (apiCall, defaultErrorMessage) => {
  try {
    return await apiCall();
  } catch (error) {
    const message = extractErrorMessage(error, defaultErrorMessage);
    // Re-throw com mensagem tratada
    const enhancedError = new Error(message);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    throw enhancedError;
  }
};

import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../constants';

interface ErrorData {
  message?: string;
  error?: string;
  errors?: Array<{ message?: string } | string>;
}

interface EnhancedError extends Error {
  originalError?: unknown;
  status?: number;
}

export const extractErrorMessage = (error: AxiosError<ErrorData>, defaultMessage: string = ERROR_MESSAGES.GENERIC): string => {
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK;
  }

  if (error.response.data) {
    const { data } = error.response;

    if (data.message) {
      return data.message;
    }

    if (data.error) {
      return data.error;
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map(e => (typeof e === 'object' && e.message) ? e.message : String(e)).join(', ');
    }

    if (typeof data === 'string') {
      return data;
    }
  }

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

export const withErrorHandling = async <T>(apiCall: () => Promise<T>, defaultErrorMessage: string): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    const message = extractErrorMessage(error as AxiosError<ErrorData>, defaultErrorMessage);
    const enhancedError: EnhancedError = new Error(message);
    enhancedError.originalError = error;
    enhancedError.status = (error as AxiosError)?.response?.status;
    throw enhancedError;
  }
};

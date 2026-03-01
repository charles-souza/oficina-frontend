import { AxiosError } from 'axios';

/**
 * Tipos de erro da aplicação
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Interface para erro padronizado
 */
export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  details?: any;
  timestamp: Date;
}

/**
 * Mapeamento de códigos HTTP para tipos de erro
 */
const HTTP_ERROR_MAP: Record<number, ErrorType> = {
  400: ErrorType.VALIDATION,
  401: ErrorType.AUTHENTICATION,
  403: ErrorType.AUTHORIZATION,
  404: ErrorType.NOT_FOUND,
  500: ErrorType.SERVER,
  502: ErrorType.SERVER,
  503: ErrorType.SERVER,
};

/**
 * Mensagens de erro amigáveis
 */
export const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]:
    'Erro de conexão. Verifique sua internet e tente novamente.',
  [ErrorType.AUTHENTICATION]:
    'Sessão expirada. Por favor, faça login novamente.',
  [ErrorType.AUTHORIZATION]:
    'Você não tem permissão para realizar esta ação.',
  [ErrorType.VALIDATION]:
    'Os dados enviados são inválidos. Verifique e tente novamente.',
  [ErrorType.NOT_FOUND]: 'O recurso solicitado não foi encontrado.',
  [ErrorType.SERVER]:
    'Erro no servidor. Por favor, tente novamente mais tarde.',
  [ErrorType.UNKNOWN]:
    'Ocorreu um erro inesperado. Por favor, tente novamente.',
};

/**
 * Extrai mensagem de erro da resposta da API
 */
function extractErrorMessage(error: AxiosError): string {
  const responseData = error.response?.data as any;

  // Tenta diferentes formatos de resposta de erro
  if (typeof responseData === 'string') {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (responseData?.errors && Array.isArray(responseData.errors)) {
    return responseData.errors.join(', ');
  }

  return error.message;
}

/**
 * Normaliza erro para formato padrão da aplicação
 */
export function normalizeError(error: unknown): AppError {
  const timestamp = new Date();

  // Erro de rede (sem resposta do servidor)
  if (error instanceof AxiosError && !error.response) {
    return {
      type: ErrorType.NETWORK,
      message: ERROR_MESSAGES[ErrorType.NETWORK],
      timestamp,
    };
  }

  // Erro HTTP do Axios
  if (error instanceof AxiosError && error.response) {
    const statusCode = error.response.status;
    const errorType = HTTP_ERROR_MAP[statusCode] || ErrorType.UNKNOWN;
    const message = extractErrorMessage(error);

    return {
      type: errorType,
      message: message || ERROR_MESSAGES[errorType],
      statusCode,
      details: error.response.data,
      timestamp,
    };
  }

  // Erro genérico
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || ERROR_MESSAGES[ErrorType.UNKNOWN],
      timestamp,
    };
  }

  // Erro desconhecido
  return {
    type: ErrorType.UNKNOWN,
    message: ERROR_MESSAGES[ErrorType.UNKNOWN],
    details: error,
    timestamp,
  };
}

/**
 * Logger de erros (pode ser integrado com serviços como Sentry)
 */
export class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: AppError[] = [];
  private maxErrors = 50;

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: AppError): void {
    this.errors.unshift(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Log no console em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('[ErrorLogger]', {
        type: error.type,
        message: error.message,
        statusCode: error.statusCode,
        timestamp: error.timestamp,
        details: error.details,
      });
    }

    // Aqui você pode adicionar integração com Sentry, LogRocket, etc
    // Example: Sentry.captureException(error);
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorsByType(type: ErrorType): AppError[] {
    return this.errors.filter((error) => error.type === type);
  }
}

/**
 * Hook de tratamento de erro global
 */
export function handleError(
  error: unknown,
  showNotification?: (message: string, severity: 'error') => void
): AppError {
  const normalizedError = normalizeError(error);
  const logger = ErrorLogger.getInstance();

  logger.log(normalizedError);

  // Mostra notificação se callback fornecido
  if (showNotification) {
    showNotification(normalizedError.message, 'error');
  }

  // Redireciona para login em caso de erro de autenticação
  if (normalizedError.type === ErrorType.AUTHENTICATION) {
    // Limpa token e redireciona
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return normalizedError;
}

/**
 * Wrapper para chamadas async com tratamento de erro
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  customErrorMessage?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const normalizedError = normalizeError(error);

    if (customErrorMessage) {
      normalizedError.message = customErrorMessage;
    }

    const logger = ErrorLogger.getInstance();
    logger.log(normalizedError);

    throw normalizedError;
  }
}

/**
 * Retry logic para chamadas que falharam
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Não tenta novamente em erros de autenticação/autorização/validação
      const normalizedError = normalizeError(error);
      if (
        [
          ErrorType.AUTHENTICATION,
          ErrorType.AUTHORIZATION,
          ErrorType.VALIDATION,
        ].includes(normalizedError.type)
      ) {
        throw normalizedError;
      }

      // Aguarda antes de tentar novamente
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw normalizeError(lastError);
}

/**
 * Verifica se é um erro específico
 */
export function isErrorType(error: unknown, type: ErrorType): boolean {
  const normalizedError = normalizeError(error);
  return normalizedError.type === type;
}

/**
 * Exportações
 */
export default {
  normalizeError,
  handleError,
  withErrorHandling,
  withRetry,
  isErrorType,
  ErrorLogger,
  ErrorType,
  ERROR_MESSAGES,
};

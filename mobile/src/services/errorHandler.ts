/**
 * Tipos de erro do sistema
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Interface para erro tratado
 */
export interface ProcessedError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
  details?: string[];
  shouldRetry?: boolean;
  shouldShowToUser?: boolean;
}

/**
 * Classe para tratamento centralizado de erros
 */
class ErrorHandler {
  /**
   * Processa um erro e retorna informações estruturadas
   */
  processError(error: any): ProcessedError {
    // Erro de rede/conectividade
    if (this.isNetworkError(error)) {
      return {
        type: ErrorType.NETWORK,
        message: 'Erro de conexão. Verifique sua internet.',
        originalError: error,
        shouldRetry: true,
        shouldShowToUser: true,
      };
    }

    // Erro de timeout
    if (this.isTimeoutError(error)) {
      return {
        type: ErrorType.NETWORK,
        message: 'Tempo limite excedido. Tente novamente.',
        originalError: error,
        shouldRetry: true,
        shouldShowToUser: true,
      };
    }

    // Erro da API com resposta
    if (error.response) {
      return this.processApiError(error);
    }

    // Erro genérico
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'Erro desconhecido',
      originalError: error,
      shouldRetry: false,
      shouldShowToUser: true,
    };
  }

  /**
   * Processa erros específicos da API
   */
  private processApiError(error: any): ProcessedError {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return this.processBadRequestError(data);
      
      case 403:
        return {
          type: ErrorType.AUTHORIZATION,
          message: 'Você não tem permissão para esta ação.',
          statusCode: status,
          originalError: error,
          shouldRetry: false,
          shouldShowToUser: true,
        };
      
      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          message: data?.message || 'Recurso não encontrado.',
          statusCode: status,
          originalError: error,
          shouldRetry: false,
          shouldShowToUser: true,
        };
      
      case 422:
        return this.processValidationError(data);
      
      case 429:
        return {
          type: ErrorType.SERVER,
          message: 'Muitas tentativas. Tente novamente em alguns minutos.',
          statusCode: status,
          originalError: error,
          shouldRetry: true,
          shouldShowToUser: true,
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.SERVER,
          message: 'Erro interno do servidor. Tente novamente.',
          statusCode: status,
          originalError: error,
          shouldRetry: true,
          shouldShowToUser: true,
        };
      
      default:
        return {
          type: ErrorType.UNKNOWN,
          message: data?.message || 'Erro desconhecido do servidor.',
          statusCode: status,
          originalError: error,
          shouldRetry: false,
          shouldShowToUser: true,
        };
    }
  }

  /**
   * Processa erros de validação (400)
   */
  private processBadRequestError(data: any): ProcessedError {
    if (data?.errors && Array.isArray(data.errors)) {
      return {
        type: ErrorType.VALIDATION,
        message: 'Dados inválidos. Verifique os campos.',
        details: data.errors.map((err: any) => 
          typeof err === 'string' ? err : err.message || 'Erro de validação'
        ),
        originalError: data,
        shouldRetry: false,
        shouldShowToUser: true,
      };
    }

    return {
      type: ErrorType.VALIDATION,
      message: data?.message || 'Dados inválidos.',
      originalError: data,
      shouldRetry: false,
      shouldShowToUser: true,
    };
  }

  /**
   * Processa erros de validação específicos (422)
   */
  private processValidationError(data: any): ProcessedError {
    const details: string[] = [];

    if (data?.errors) {
      if (Array.isArray(data.errors)) {
        details.push(...data.errors.map((err: any) => 
          typeof err === 'string' ? err : err.message || 'Erro de validação'
        ));
      } else if (typeof data.errors === 'object') {
        // Formato { field: ['error1', 'error2'] }
        Object.entries(data.errors).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach(error => details.push(`${field}: ${error}`));
          } else {
            details.push(`${field}: ${errors}`);
          }
        });
      }
    }

    return {
      type: ErrorType.VALIDATION,
      message: data?.message || 'Erro de validação nos dados enviados.',
      details,
      originalError: data,
      shouldRetry: false,
      shouldShowToUser: true,
    };
  }

  /**
   * Verifica se é um erro de rede
   */
  private isNetworkError(error: any): boolean {
    return (
      !error.response &&
      (error.code === 'NETWORK_ERROR' ||
       error.code === 'ECONNREFUSED' ||
       error.code === 'ENOTFOUND' ||
       error.message?.includes('Network Error'))
    );
  }

  /**
   * Verifica se é um erro de timeout
   */
  private isTimeoutError(error: any): boolean {
    return (
      error.code === 'ECONNABORTED' ||
      error.message?.includes('timeout')
    );
  }


}

// Instância singleton do manipulador de erros
export const errorHandler = new ErrorHandler();

// Função utilitária para processar erros rapidamente
export const processError = (error: any, context?: string): ProcessedError => {
  const processedError = errorHandler.processError(error);
  return processedError;
};

// Função utilitária para obter mensagem amigável
export const getErrorMessage = (error: any, context?: string): string => {
  const processedError = processError(error, context);
  return processedError.message;
};
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Configurações da API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
} as const;

// Interface para configuração customizada
export interface ApiRequestConfig extends AxiosRequestConfig {
  skipErrorHandling?: boolean;
  retryAttempts?: number;
}

// Interface para resposta padronizada da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// Interface para erro da API
export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
  code?: string;
}

// Classe para gerenciar a configuração da API
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: any) => {
        // Log da requisição em desenvolvimento
        // if (__DEV__) {
        //   console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        //     data: config.data,
        //     params: config.params,
        //   });
        // }

        return config;
      },
      (error: AxiosError) => {
        if (__DEV__) {
          console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log da resposta em desenvolvimento
        // if (__DEV__) {
        //   console.log(` API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        //     status: response.status,
        //     data: response.data,
        //   });
        // }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as ApiRequestConfig;

        // Log do erro em desenvolvimento
        // if (__DEV__) {
        //   console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        //     status: error.response?.status,
        //     message: error.message,
        //     data: error.response?.data,
        //   });
        // }

        // Preservar o erro original do axios para que o dishService possa acessar error.response
        return Promise.reject(error);
      }
    );
  }



  // Métodos públicos para fazer requisições
  public get<T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  public delete<T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  // Método para atualizar a base URL (útil para diferentes ambientes)
  public setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }
}

// Instância singleton da API
export const apiClient = new ApiClient();

// Export da instância do axios para casos específicos
export const axiosInstance = apiClient;
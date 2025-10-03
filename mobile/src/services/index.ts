// ============================================================================
// API CONFIGURATION
// ============================================================================
export { apiClient, axiosInstance, API_CONFIG } from './apiConfig';
export type { ApiRequestConfig, ApiResponse, ApiError } from './apiConfig';

// ============================================================================
// SERVICES
// ============================================================================
export { dishService, DishService } from './dishService';
export { orderService, OrderService } from './orderService';

// ============================================================================
// ERROR HANDLING
// ============================================================================
export { 
  errorHandler, 
  processError, 
  getErrorMessage,
  ErrorType 
} from './errorHandler';
export type { ProcessedError } from './errorHandler';
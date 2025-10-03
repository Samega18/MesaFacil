// ============================================================================
// LEGACY CONSTANTS (mantendo compatibilidade)
// ============================================================================
export const menuCategories = ['Todos', 'Entradas', 'Pratos Principais', 'Sobremesas', 'Bebidas'];
export const orderFilters = ['Todos', 'Recebido', 'Em Preparo', 'Pronto', 'Entregue'];
export const orderStatus = ['Recebido', 'Em Preparo', 'Pronto', 'Entregue'];

// ============================================================================
// API CONSTANTS
// ============================================================================

/**
 * URLs base para diferentes ambientes
 */
export const API_BASE_URLS = {
  DEVELOPMENT: 'http://localhost:3000/api',
  //STAGING: 'https://staging-api.mesafacil.com/api',
  //PRODUCTION: 'https://api.mesafacil.com/api',
} as const;

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Dishes
  DISHES: '/dishes',
  DISH_BY_ID: (id: string | number) => `/dishes/${id}`,
  DISHES_BY_CATEGORY: '/dishes/category',
  DISHES_SEARCH: '/dishes/search',
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string | number) => `/orders/${id}`,
  ORDERS_BY_STATUS: '/orders/status',
  ORDER_STATISTICS: '/orders/statistics',
  DASHBOARD: '/dashboard',
  
  // Health
  HEALTH: '/health',
} as const;

/**
 * Timeouts para diferentes tipos de operação (em ms)
 */
export const API_TIMEOUTS = {
  DEFAULT: 10000,      // 10 segundos
  UPLOAD: 30000,       // 30 segundos
  DOWNLOAD: 60000,     // 60 segundos
  CRITICAL: 5000,      // 5 segundos
} as const;

/**
 * Configurações de retry
 */
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_FACTOR: 2,
} as const;

// ============================================================================
// BUSINESS CONSTANTS
// ============================================================================



// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * Chaves para armazenamento local
 */
export const STORAGE_KEYS = {
  USER_DATA: '@mesafacil:user_data',
  THEME: '@mesafacil:theme',
  LANGUAGE: '@mesafacil:language',
  CACHE_DISHES: '@mesafacil:cache_dishes',
  CACHE_ORDERS: '@mesafacil:cache_orders',
  SETTINGS: '@mesafacil:settings',
} as const;

// ============================================================================
// QUERY KEYS (para React Query)
// ============================================================================

/**
 * Chaves de query para cache
 */
export const QUERY_KEYS = {
  // Dishes
  DISHES: ['dishes'],
  DISH: (id: string | number) => ['dish', id],
  DISHES_BY_CATEGORY: (category: string) => ['dishes', 'category', category],
  ACTIVE_DISHES: ['dishes', 'active'],
  DISH_SEARCH: (query: string) => ['dishes', 'search', query],
  
  // Orders
  ORDERS: ['orders'],
  ORDER: (id: string | number) => ['order', id],
  ORDERS_BY_STATUS: (status: string) => ['orders', 'status', status],
  PENDING_ORDERS: ['orders', 'pending'],
  TODAY_ORDERS: ['orders', 'today'],
  ORDER_STATISTICS: ['orders', 'statistics'],
  DASHBOARD: ['dashboard'],
} as const;

// ============================================================================
// WEBSOCKET EVENTS
// ============================================================================

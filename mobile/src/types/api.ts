import { Dish, Order, OrderItem, DishCategory, OrderStatus } from './models';

// ============================================================================
// BASE API TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
  code?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// DISH API TYPES
// ============================================================================

export interface CreateDishRequest {
  name: string;
  description: string;
  price: number;
  category: DishCategory;
  active?: boolean;
  image?: string;
}

export interface UpdateDishRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: DishCategory;
  active?: boolean;
  image?: string;
}

export interface DishFilters extends PaginationParams {
  category?: DishCategory;
  active?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface DishResponse extends Dish {
  // Campos adicionais que podem vir da API
}

export interface DishListResponse extends PaginatedResponse<DishResponse> {}

// ============================================================================
// ORDER API TYPES
// ============================================================================

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  notes?: string;
  status?: OrderStatus;
}

export interface CreateOrderItemRequest {
  dishId: string;
  quantity: number;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  notes?: string;
}

export interface OrderFilters extends PaginationParams {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  minValue?: number;
  maxValue?: number;
}

export interface OrderResponse extends Order {
  items: OrderItemResponse[];
}

export interface OrderItemResponse extends OrderItem {
  dish: DishResponse;
}

export interface OrderListResponse extends PaginatedResponse<OrderResponse> {}

// ============================================================================
// STATISTICS API TYPES
// ============================================================================

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  topDishes: Array<{
    dish: DishResponse;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  revenueByPeriod: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface DashboardData {
  todayStats: {
    orders: number;
    revenue: number;
    averageOrderValue: number;
  };
  weekStats: {
    orders: number;
    revenue: number;
    growth: number; // percentual
  };
  monthStats: {
    orders: number;
    revenue: number;
    growth: number; // percentual
  };
  recentOrders: OrderResponse[];
  popularDishes: Array<{
    dish: DishResponse;
    orderCount: number;
  }>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  method: ApiMethod;
  path: string;
  description?: string;
}

// Mapeamento de endpoints da API
export const API_ENDPOINTS = {
  // Dishes
  DISHES: {
    LIST: { method: 'GET' as const, path: '/dishes' },
    GET: { method: 'GET' as const, path: '/dishes/:id' },
    CREATE: { method: 'POST' as const, path: '/dishes' },
    UPDATE: { method: 'PUT' as const, path: '/dishes/:id' },
    DELETE: { method: 'DELETE' as const, path: '/dishes/:id' },
  },
  
  // Orders
  ORDERS: {
    LIST: { method: 'GET' as const, path: '/orders' },
    GET: { method: 'GET' as const, path: '/orders/:id' },
    CREATE: { method: 'POST' as const, path: '/orders' },
    UPDATE: { method: 'PUT' as const, path: '/orders/:id' },
    DELETE: { method: 'DELETE' as const, path: '/orders/:id' },
  },
  
  // Statistics
  STATISTICS: {
    ORDERS: { method: 'GET' as const, path: '/statistics/orders' },
    DASHBOARD: { method: 'GET' as const, path: '/statistics/dashboard' },
  },
} as const;
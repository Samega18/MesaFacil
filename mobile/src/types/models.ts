// Database types
export type DishCategory = 'APPETIZER' | 'MAIN_COURSE' | 'DESSERT' | 'DRINK';
export type OrderStatus = 'PENDING' | 'RECEIVED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

// Main dish interface (database compatible)
export interface Dish {
  id: string; // database uuid
  name: string;
  description: string;
  price: number;
  category: DishCategory;
  active: boolean;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

// Cart item interface
export interface CartItem {
  id: string;
  dish: Dish;
  quantity: number;
  subtotal: number;
}

// Order item interface (compatible with ORDER_DISHES table)
export interface OrderItem {
  id: string;
  order_id: string;
  dish_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
}

// Main order interface (database compatible)
export interface Order {
  id: string; // database uuid
  total_value: number;
  status: OrderStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

// Extended order interface for UI compatibility
export interface OrderWithUI extends Order {
  orderNumber?: string;
  date?: string;
  time?: string;
  total?: number;
  isExpanded?: boolean;
  isLoading?: boolean;
}

// Legacy types for backward compatibility
export interface LegacyOrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface LegacyOrder {
  id: number;
  orderNumber: string;
  date: string;
  time: string;
  items: string;
  total: number;
  status: string;
}
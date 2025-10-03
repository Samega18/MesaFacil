// ============================================================================
// HOOKS EXPORTS
// ============================================================================

// Dish hooks
export {
  useDishes,
  useDish,
  useDishMutations,
  useDishesByCategory,
  useActiveDishes,
  useDishSearch,
  useDishManager,
} from './api/useDishes';

// Order hooks
export {
  useOrders,
  useOrder,
  useOrderMutations,
  useOrdersByStatus,
  usePendingOrders,
  useTodayOrders,
  useOrderStatistics,
  useDashboard,
  useOrderManager,
} from './api/useOrders';
import { useDishStore } from '../stores/dishStore';
import { useOrderStore } from '../stores/orderStore';

/**
 * Utilitário para gerenciar dados mock em todas as stores
 */
export class MockDataManager {
  /**
   * Habilita o uso de dados mock em todas as stores
   */
  static enableMockData() {
    const dishStore = useDishStore.getState();
    const orderStore = useOrderStore.getState();
    
    // Habilita mock data nas stores
    dishStore.setUseMockData(true);
    orderStore.setUseMockData(true);
    
    // Carrega os dados mock
    dishStore.loadMockData();
    orderStore.loadMockData();
    
    console.log('✅ Dados mock habilitados em todas as stores');
  }
  
  /**
   * Desabilita o uso de dados mock em todas as stores
   */
  static disableMockData() {
    const dishStore = useDishStore.getState();
    const orderStore = useOrderStore.getState();
    
    // Desabilita mock data nas stores
    dishStore.setUseMockData(false);
    orderStore.setUseMockData(false);
    
    // Limpa os dados atuais (forçará reload da API)
    dishStore.setDishes([]);
    orderStore.setOrders([]);
    
    console.log('✅ Dados mock desabilitados - usando dados reais da API');
  }
  
  /**
   * Verifica se os dados mock estão habilitados
   */
  static isMockDataEnabled(): boolean {
    const dishStore = useDishStore.getState();
    const orderStore = useOrderStore.getState();
    
    return dishStore.useMockData && orderStore.useMockData;
  }
  
  /**
   * Alterna entre dados mock e dados reais
   */
  static toggleMockData() {
    if (this.isMockDataEnabled()) {
      this.disableMockData();
    } else {
      this.enableMockData();
    }
  }
  
  /**
   * Recarrega os dados mock (útil para testes)
   */
  static reloadMockData() {
    const dishStore = useDishStore.getState();
    const orderStore = useOrderStore.getState();
    
    if (dishStore.useMockData) {
      dishStore.loadMockData();
    }
    
    if (orderStore.useMockData) {
      orderStore.loadMockData();
    }
    
    console.log('🔄 Dados mock recarregados');
  }
  
  /**
   * Obtém estatísticas dos dados mock
   */
  static getMockDataStats() {
    const dishStore = useDishStore.getState();
    const orderStore = useOrderStore.getState();
    
    return {
      mockDataEnabled: this.isMockDataEnabled(),
      dishesCount: dishStore.dishes.length,
      ordersCount: orderStore.orders.length,
      mockDishesAvailable: dishStore.mockDishes?.length || 0,
      mockOrdersAvailable: orderStore.mockOrders?.length || 0
    };
  }
}

// Exporta uma instância para uso direto
export const mockDataManager = MockDataManager;

// Para desenvolvimento - expõe no window para facilitar testes
if (__DEV__) {
  (global as any).mockDataManager = MockDataManager;
}
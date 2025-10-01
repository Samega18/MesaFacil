import { useDishStore } from '../stores/dishStore';
import { useOrderStore } from '../stores/orderStore';
import { MockDataManager } from '../utils/mockDataManager';

/**
 * Testes para verificar o funcionamento das stores com dados mock
 */
export class MockStoreTest {
  
  /**
   * Testa a DishStore com dados mock
   */
  static async testDishStore() {
    console.log('🧪 Testando DishStore com dados mock...');
    
    const dishStore = useDishStore.getState();
    
    // Habilita dados mock
    dishStore.setUseMockData(true);
    
    // Carrega dados mock
    dishStore.loadMockData();
    
    // Verifica se os dados foram carregados
    const dishes = dishStore.dishes;
    console.log(`✅ ${dishes.length} pratos carregados do mock`);
    
    // Testa busca por categoria
    const mainDishes = dishStore.getDishesByCategory('MAIN_COURSE');
    console.log(`✅ ${mainDishes.length} pratos principais encontrados`);
    
    // Testa busca por ID
    const firstDish = dishStore.getDishById('1');
    console.log(`✅ Prato encontrado por ID: ${firstDish?.name || 'Não encontrado'}`);
    
    // Testa fetchDishes com mock
    console.log('🔄 Testando fetchDishes com mock...');
    await dishStore.fetchDishes();
    console.log(`✅ fetchDishes executado - ${dishStore.dishes.length} pratos disponíveis`);
    
    return {
      totalDishes: dishes.length,
      mainDishes: mainDishes.length,
      firstDishFound: !!firstDish
    };
  }
  
  /**
   * Testa a OrderStore com dados mock
   */
  static async testOrderStore() {
    console.log('🧪 Testando OrderStore com dados mock...');
    
    const orderStore = useOrderStore.getState();
    
    // Habilita dados mock
    orderStore.setUseMockData(true);
    
    // Carrega dados mock
    orderStore.loadMockData();
    
    // Verifica se os dados foram carregados
    const orders = orderStore.orders;
    console.log(`✅ ${orders.length} pedidos carregados do mock`);
    
    // Testa busca por ID
    const firstOrder = orderStore.getOrderById('1');
    console.log(`✅ Pedido encontrado por ID: ${firstOrder?.id || 'Não encontrado'}`);
    
    // Testa fetchOrders com mock
    console.log('🔄 Testando fetchOrders com mock...');
    await orderStore.fetchOrders();
    console.log(`✅ fetchOrders executado - ${orderStore.orders.length} pedidos disponíveis`);
    
    return {
      totalOrders: orders.length,
      firstOrderFound: !!firstOrder
    };
  }
  
  /**
   * Testa o MockDataManager
   */
  static testMockDataManager() {
    console.log('🧪 Testando MockDataManager...');
    
    // Testa habilitação de dados mock
    MockDataManager.enableMockData();
    console.log(`✅ Mock data habilitado: ${MockDataManager.isMockDataEnabled()}`);
    
    // Testa estatísticas
    const stats = MockDataManager.getMockDataStats();
    console.log('📊 Estatísticas dos dados mock:', stats);
    
    // Testa alternância
    MockDataManager.toggleMockData();
    console.log(`✅ Após toggle: ${MockDataManager.isMockDataEnabled()}`);
    
    // Reabilita para os próximos testes
    MockDataManager.enableMockData();
    
    return stats;
  }
  
  /**
   * Executa todos os testes
   */
  static async runAllTests() {
    console.log('🚀 Iniciando testes das stores com dados mock...\n');
    
    try {
      // Testa MockDataManager
      const managerStats = this.testMockDataManager();
      console.log('\n');
      
      // Testa DishStore
      const dishResults = await this.testDishStore();
      console.log('\n');
      
      // Testa OrderStore
      const orderResults = await this.testOrderStore();
      console.log('\n');
      
      // Resumo dos testes
      console.log('📋 RESUMO DOS TESTES:');
      console.log('===================');
      console.log(`✅ MockDataManager funcionando: ${MockDataManager.isMockDataEnabled()}`);
      console.log(`✅ DishStore - ${dishResults.totalDishes} pratos, ${dishResults.mainDishes} principais`);
      console.log(`✅ OrderStore - ${orderResults.totalOrders} pedidos carregados`);
      console.log(`✅ Pratos mock disponíveis: ${managerStats.mockDishesAvailable}`);
      console.log(`✅ Pedidos mock disponíveis: ${managerStats.mockOrdersAvailable}`);
      
      return {
        success: true,
        dishStore: dishResults,
        orderStore: orderResults,
        manager: managerStats
      };
      
    } catch (error) {
      console.error('❌ Erro durante os testes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

// Para desenvolvimento - expõe no window para facilitar testes
if (__DEV__) {
  (global as any).MockStoreTest = MockStoreTest;
  
  // Executa testes automaticamente em desenvolvimento
  setTimeout(() => {
    MockStoreTest.runAllTests();
  }, 2000);
}
# MesaFácil Mobile - Documentação da API

## Visão Geral

O MesaFácil Mobile é um aplicativo React Native desenvolvido com Expo que oferece uma interface intuitiva para gerenciamento de restaurantes. O app permite gerenciar pratos, pedidos e visualizar estatísticas em tempo real.

## Estrutura do Projeto

```
src/
├── assets/                    # Recursos estáticos
│   └── images/               # Imagens do aplicativo
│       └── default-dish.svg  # Imagem padrão para pratos
├── components/               # Componentes reutilizáveis
│   ├── common/              # Componentes comuns
│   │   ├── ConfirmationModal/
│   │   ├── FallbackImage/
│   │   ├── Toast/
│   │   └── index.ts         # Barrel export
│   ├── dishes/              # Componentes relacionados a pratos
│   │   ├── DishCard/
│   │   ├── DishList/
│   │   ├── DishModal/
│   │   ├── LazyDishModal/
│   │   ├── ManageDishesHeader/
│   │   └── index.ts
│   ├── filters/             # Componentes de filtros
│   │   ├── CategoryFilter/
│   │   ├── OrdersFilter/
│   │   └── index.ts
│   ├── menu/                # Componentes do menu
│   │   ├── MenuItemCard/
│   │   └── index.ts
│   ├── orders/              # Componentes relacionados a pedidos
│   │   ├── CreateOrderHeader/
│   │   ├── OrderCard/
│   │   ├── OrderItemCard/
│   │   ├── OrderItemsList/
│   │   ├── OrderSummary/
│   │   ├── UpdateStatusModal/
│   │   └── index.ts
│   ├── ui/                  # Componentes de interface
│   │   ├── Button/
│   │   ├── SafeScreen/
│   │   └── index.ts
│   └── index.ts             # Barrel export principal
├── contexts/                # Contextos React
│   ├── ThemeContext.tsx     # Gerenciamento de tema
│   └── ToastContext.tsx     # Sistema de notificações
├── data/                    # Dados mockados
│   └── mocks.ts            # Dados de exemplo
├── hooks/                   # Hooks customizados
│   ├── api/                # Hooks para API
│   │   ├── useDishes.ts    # Hooks para pratos
│   │   └── useOrders.ts    # Hooks para pedidos
│   ├── useDishManagement.ts
│   ├── useOrderManagement.ts
│   ├── useOrdersList.ts
│   ├── useSystemNavigationBar.ts
│   └── index.ts            # Barrel export
├── navigation/              # Configuração de navegação
│   ├── CreateOrderStack.tsx
│   ├── MenuStack.tsx
│   ├── OrdersStack.tsx
│   ├── SettingsStack.tsx
│   ├── TabNavigator.tsx
│   └── index.tsx
├── screens/                 # Telas do aplicativo
│   ├── CreateOrder/        # Tela de criação de pedidos
│   ├── ManageDishes/       # Tela de gerenciamento de pratos
│   ├── Menu/               # Tela do menu
│   ├── OrdersList/         # Tela de lista de pedidos
│   └── Settings/           # Tela de configurações
├── services/               # Serviços de API
│   ├── apiConfig.ts        # Configuração da API
│   ├── dishService.ts      # Serviço de pratos
│   ├── errorHandler.ts     # Tratamento de erros
│   ├── orderService.ts     # Serviço de pedidos
│   ├── orderStatusService.ts # Serviço de status de pedidos
│   └── index.ts           # Barrel export
├── stores/                 # Gerenciamento de estado (Zustand)
│   ├── cartStore.ts       # Store do carrinho
│   ├── dishStore.ts       # Store de pratos
│   ├── orderStore.ts      # Store de pedidos
│   └── index.ts          # Barrel export
├── styles/                # Estilos globais
│   ├── colors.ts         # Paleta de cores
│   ├── metrics.ts        # Métricas de layout
│   ├── typography.ts     # Tipografia
│   └── index.ts         # Barrel export
├── tests/                # Testes
│   └── storeTest.ts     # Testes dos stores
├── types/               # Definições de tipos
│   ├── api.ts          # Tipos da API
│   ├── models.ts       # Modelos de dados
│   ├── navigation.ts   # Tipos de navegação
│   └── index.ts       # Barrel export
└── utils/             # Utilitários
    ├── categoryTranslations.ts # Traduções de categorias
    └── constants.ts           # Constantes da aplicação
```

## Principais Funcionalidades

### 🍽️ Gerenciamento de Pratos
- Visualização de pratos por categoria
- Criação, edição e exclusão de pratos
- Upload de imagens
- Controle de disponibilidade
- Busca e filtros avançados

### 📋 Gerenciamento de Pedidos
- Criação de novos pedidos
- Atualização de status (Pendente, Em Preparo, Pronto, Entregue)
- Visualização de pedidos por status
- Histórico completo de pedidos
- Estatísticas em tempo real

### 🎨 Interface e Experiência
- Design responsivo e intuitivo
- Sistema de notificações (Toast)
- Modais de confirmação
- Navegação por abas
- Tema consistente

## Tecnologias Utilizadas

- **React Native** com Expo
- **TypeScript** para tipagem estática
- **Zustand** para gerenciamento de estado
- **React Navigation** para navegação
- **Styled Components** para estilização
- **React Query** para cache e sincronização de dados

## Hooks Disponíveis

### Hooks de Pratos (`useDishes.ts`)
```typescript
// Hooks principais
useDishes()           // Lista todos os pratos
useDish(id)          // Busca prato específico
useDishMutations()   // Operações CRUD
useDishesByCategory() // Pratos por categoria
useActiveDishes()    // Apenas pratos ativos
useDishSearch()      // Busca de pratos
useDishManager()     // Gerenciamento completo
```

### Hooks de Pedidos (`useOrders.ts`)
```typescript
// Hooks principais
useOrders()          // Lista todos os pedidos
useOrder(id)         // Busca pedido específico
useOrderMutations()  // Operações CRUD
useOrdersByStatus()  // Pedidos por status
usePendingOrders()   // Pedidos pendentes
useTodayOrders()     // Pedidos do dia
useOrderStatistics() // Estatísticas
useDashboard()       // Dados do dashboard
useOrderManager()    // Gerenciamento completo
```

## Serviços de API

### DishService
```typescript
// Operações disponíveis
dishService.getAll()           // Lista pratos
dishService.getById(id)        // Busca por ID
dishService.create(data)       // Cria prato
dishService.update(id, data)   // Atualiza prato
dishService.delete(id)         // Remove prato
dishService.getByCategory(cat) // Busca por categoria
```

### OrderService
```typescript
// Operações disponíveis
orderService.getAll()          // Lista pedidos
orderService.getById(id)       // Busca por ID
orderService.create(data)      // Cria pedido
orderService.update(id, data)  // Atualiza pedido
orderService.updateStatus(id, status) // Atualiza status
orderService.getStatistics()  // Estatísticas
```

## Stores (Zustand)

### DishStore
```typescript
interface DishStore {
  dishes: Dish[];
  selectedDish: Dish | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setDishes: (dishes: Dish[]) => void;
  addDish: (dish: Dish) => void;
  updateDish: (id: string, dish: Partial<Dish>) => void;
  removeDish: (id: string) => void;
  setSelectedDish: (dish: Dish | null) => void;
}
```

### OrderStore
```typescript
interface OrderStore {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setSelectedOrder: (order: Order | null) => void;
}
```

### CartStore
```typescript
interface CartStore {
  items: CartItem[];
  total: number;
  
  // Actions
  addItem: (dish: Dish, quantity: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => void;
}
```

## Tipos Principais

### Modelos de Dados
```typescript
interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: DishCategory;
  imageUrl?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  customerName?: string;
  tableNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  dishId: string;
  dish: Dish;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';
type DishCategory = 'appetizer' | 'main' | 'dessert' | 'beverage';
```

## Configuração da API

A configuração da API está centralizada em `src/services/apiConfig.ts`:

```typescript
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

## Sistema de Navegação

O app utiliza React Navigation com estrutura de abas:

- **Menu**: Visualização do cardápio
- **Pedidos**: Gerenciamento de pedidos
- **Criar Pedido**: Interface para novos pedidos
- **Configurações**: Configurações do app

## Tratamento de Erros

O sistema possui tratamento centralizado de erros em `errorHandler.ts`:

```typescript
export const errorHandler = {
  processError: (error: unknown) => ProcessedError,
  getErrorMessage: (error: unknown) => string,
};
```

## Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Editar .env com suas configurações
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

4. **Executar em dispositivo/emulador:**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Estrutura de Componentes

O projeto utiliza um sistema de "barrel exports" para organizar as importações:

```typescript
// Importação simplificada
import { DishCard, DishList, DishModal } from '../../components';

// Em vez de múltiplas importações
import { DishCard } from '../../components/dishes/DishCard';
import { DishList } from '../../components/dishes/DishList';
import { DishModal } from '../../components/dishes/DishModal';
```

---

**Nota**: Esta documentação reflete o estado atual do projeto mobile. Para informações sobre a API backend, consulte a documentação específica do servidor.
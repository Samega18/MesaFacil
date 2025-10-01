import { useState, useCallback } from 'react';
import { OrderItem, CartItem, LegacyOrderItem } from '../types/models';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { orderStatus } from '../utils/constants';

/**
 * Hook para gerenciar estado e lógica de negócio do pedido.
 * Centraliza operações de quantidade, cálculos, status e remoção.
 * Facilita testes unitários e reutilização.
 * Agora integrado com cartStore para gerenciar itens do carrinho.
 */
export const useOrderManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState(orderStatus[0]); // 'Recebido' como padrão
  const [pendingRemoval, setPendingRemoval] = useState<{
    itemId: string;
    itemName: string;
  } | null>(null);

  // Integração com stores
  const { 
    items: cartItems, 
    updateQuantity: updateCartQuantity, 
    removeItem: removeCartItem,
    getTotal,
    clearCart
  } = useCartStore();
  
  const { createOrder } = useOrderStore();

  // Converte CartItem para LegacyOrderItem para compatibilidade com UI
  // Mantém um mapeamento entre IDs numéricos (UI) e IDs string (store)
  const orderItems: LegacyOrderItem[] = cartItems.map((cartItem, index) => ({
    id: index + 1, // ID numérico sequencial para UI
    name: cartItem.dish.name,
    price: cartItem.dish.price,
    quantity: cartItem.quantity,
    image: cartItem.dish.image,
  }));

  // Função auxiliar para encontrar CartItem pelo ID numérico da UI
  const findCartItemByUIId = (uiId: number): CartItem | undefined => {
    const index = uiId - 1; // Converte ID da UI (1-based) para índice (0-based)
    return cartItems[index];
  };

  /**
   * Atualiza quantidade de um item específico.
   * Se quantidade chegar a 0, solicita confirmação para remoção.
   */
  const updateQuantity = useCallback((id: string, increment: boolean) => {
    // Converte ID da UI (string) para número e encontra o CartItem correspondente
    const uiId = parseInt(id);
    const cartItem = findCartItemByUIId(uiId);
    if (!cartItem) return;

    const newQuantity = increment ? cartItem.quantity + 1 : cartItem.quantity - 1;

    // Se quantidade chegou a 0, solicita confirmação para remoção
    if (newQuantity === 0) {
      setPendingRemoval({
        itemId: cartItem.id, // Usa o ID real do CartItem
        itemName: cartItem.dish.name || 'Item sem nome',
      });
      return; // Mantém quantidade atual até confirmação
    }

    // Atualiza quantidade no cartStore usando o ID real do CartItem
    updateCartQuantity(cartItem.id, newQuantity);
  }, [cartItems, updateCartQuantity, findCartItemByUIId]);

  /**
   * Confirma remoção do item do pedido.
   */
  const confirmRemoveItem = useCallback(() => {
    if (!pendingRemoval) return;

    removeCartItem(pendingRemoval.itemId);
    setPendingRemoval(null);
  }, [pendingRemoval, removeCartItem]);

  /**
   * Cancela remoção do item, mantendo quantidade atual.
   */
  const cancelRemoveItem = useCallback(() => {
    setPendingRemoval(null);
  }, []);

  /**
   * Calcula subtotal baseado nos itens do carrinho.
   */
  const calculateSubtotal = useCallback(() => {
    return getTotal();
  }, [getTotal]);

  /**
   * Processa confirmação do pedido.
   * Integra com orderStore para criar o pedido.
   */
  const confirmOrder = useCallback(async () => {
    if (cartItems.length === 0) {
      console.warn('Não é possível criar pedido sem itens');
      return;
    }

    try {
      const order = await createOrder(cartItems, `Status: ${selectedStatus}`);
      if (order) {
        console.log('Pedido criado com sucesso:', order);
        clearCart(); // Limpa o carrinho após criar o pedido
        // TODO: Navegar para tela de confirmação ou lista de pedidos
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  }, [cartItems, selectedStatus, createOrder, clearCart]);

  return {
    // Estado
    selectedStatus,
    orderItems,
    pendingRemoval,
    
    // Ações
    setSelectedStatus,
    updateQuantity,
    confirmRemoveItem,
    cancelRemoveItem,
    confirmOrder,
    
    // Valores calculados
    total: calculateSubtotal(),
  };
};
import { OrderStatus } from '../types/models';

/**
 * Configuração de cores para cada status de pedido.
 * Centraliza lógica de aparência de status.
 */
interface StatusColorConfig {
  bg: string;
  bgDark: string;
  text: string;
  textDark: string;
}

/**
 * Serviço responsável por fornecer configurações visuais dos status de pedidos.
 * Aplica SRP: única responsabilidade de gerenciar aparência de status.
 */
export class OrderStatusService {
  private static readonly statusColors: Record<OrderStatus, StatusColorConfig> = {
    'RECEIVED': {
      bg: 'rgba(239, 68, 68, 0.1)',
      bgDark: 'rgba(239, 68, 68, 0.2)',
      text: '#DC2626',
      textDark: '#FCA5A5'
    },
    'PREPARING': {
      bg: 'rgba(59, 130, 246, 0.1)',
      bgDark: 'rgba(59, 130, 246, 0.2)',
      text: '#2563EB',
      textDark: '#93C5FD'
    },
    'READY': {
      bg: 'rgba(234, 179, 8, 0.1)',
      bgDark: 'rgba(234, 179, 8, 0.2)',
      text: '#CA8A04',
      textDark: '#FDE047'
    },
    'DELIVERED': {
      bg: 'rgba(34, 197, 94, 0.1)',
      bgDark: 'rgba(34, 197, 94, 0.2)',
      text: '#16A34A',
      textDark: '#86EFAC'
    }
  };

  /**
   * Retorna configuração de cores para um status específico.
   */
  static getStatusColors(status: OrderStatus): StatusColorConfig {
    return this.statusColors[status];
  }

  /**
   * Retorna lista de todos os status disponíveis.
   */
  static getAllStatuses(): OrderStatus[] {
    return Object.keys(this.statusColors) as OrderStatus[];
  }
}
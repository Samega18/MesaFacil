import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { metrics, typography } from '../../styles';
import { OrderWithUI, OrderStatus } from '../../types/models';

interface UpdateStatusModalProps {
  visible: boolean;
  order: OrderWithUI | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
}

const { height: screenHeight } = Dimensions.get('window');

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  visible,
  order,
  onClose,
  onUpdateStatus,
}) => {
  const { colors } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [notes, setNotes] = useState('');
  const [slideAnim] = useState(new Animated.Value(screenHeight));

  // Mapear status para labels em português
  const statusLabels: Record<OrderStatus, string> = {
    RECEIVED: 'Recebido',
    PREPARING: 'Preparando',
    READY: 'Pronto',
    DELIVERED: 'Entregue',
  };

  // Mapear status atual para labels em português
  const getCurrentStatusLabel = (status: OrderStatus): string => {
    return statusLabels[status] || status;
  };

  // Definir próximos status possíveis baseado no status atual
  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'RECEIVED':
        return ['PREPARING'];
      case 'PREPARING':
        return ['READY'];
      case 'READY':
        return ['DELIVERED'];
      case 'DELIVERED':
        return [];
      default:
        return [];
    }
  };

  // Animação de entrada/saída do modal
  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // Reset do estado quando o modal abre
  React.useEffect(() => {
    if (visible && order) {
      setSelectedStatus(null);
      setNotes('');
    }
  }, [visible, order]);

  const handleStatusSelect = useCallback((status: OrderStatus) => {
    setSelectedStatus(status);
  }, []);

  const handleUpdateStatus = useCallback(() => {
    if (order && selectedStatus) {
      onUpdateStatus(order.id, selectedStatus, notes.trim() || undefined);
      onClose();
    }
  }, [order, selectedStatus, notes, onUpdateStatus, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!order) return null;

  const nextStatuses = getNextStatuses(order.status);
  const canUpdate = selectedStatus && nextStatuses.includes(selectedStatus);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.background,
      borderTopLeftRadius: metrics.radius.card,
      borderTopRightRadius: metrics.radius.card,
      maxHeight: screenHeight * 0.8,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 6,
      backgroundColor: colors.divider,
      borderRadius: 3,
      marginTop: metrics.spacing.sm,
      marginBottom: metrics.spacing.sm,
    },
    header: {
      paddingHorizontal: metrics.spacing.md,
      paddingVertical: metrics.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerContent: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      ...typography.textStyles.h3,
      fontFamily: typography.fonts.inter.bold,
      color: colors.text,
    },
    headerSubtitle: {
      ...typography.textStyles.body2,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: metrics.spacing.md,
    },
    section: {
      marginBottom: metrics.spacing.lg,
    },
    currentStatusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    currentStatusLabel: {
      ...typography.textStyles.body1,
      color: colors.text,
    },
    currentStatusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: metrics.spacing.xs,
    },
    statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.feedback.success,
    },
    statusIndicatorPulse: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.feedback.success,
      opacity: 0.75,
    },
    currentStatusText: {
      ...typography.textStyles.body2,
      fontFamily: typography.fonts.inter.medium,
      color: colors.text,
    },
    sectionTitle: {
      ...typography.textStyles.body1,
      fontFamily: typography.fonts.inter.bold,
      color: colors.text,
      marginBottom: metrics.spacing.sm,
    },
    statusButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: metrics.spacing.sm,
    },
    statusButton: {
      paddingHorizontal: metrics.spacing.md,
      paddingVertical: metrics.spacing.sm,
      borderRadius: metrics.radius.pill,
      borderWidth: 1,
    },
    statusButtonActive: {
      backgroundColor: `${colors.primary}20`,
      borderColor: colors.primary,
    },
    statusButtonInactive: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.divider,
    },
    statusButtonDisabled: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.divider,
      opacity: 0.5,
    },
    statusButtonText: {
      ...typography.textStyles.body2,
      fontFamily: typography.fonts.inter.medium,
    },
    statusButtonTextActive: {
      color: colors.primary,
    },
    statusButtonTextInactive: {
      color: colors.textSecondary,
    },
    notesLabel: {
      ...typography.textStyles.body1,
      fontFamily: typography.fonts.inter.bold,
      color: colors.text,
      marginBottom: metrics.spacing.sm,
    },
    notesInput: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: metrics.radius.input,
      padding: metrics.spacing.sm,
      ...typography.textStyles.body2,
      color: colors.text,
      textAlignVertical: 'top',
      minHeight: 80,
    },
    footer: {
      padding: metrics.spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      flexDirection: 'row',
      gap: metrics.spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: metrics.spacing.sm,
      borderRadius: metrics.radius.input,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: colors.backgroundSecondary,
    },
    updateButton: {
      backgroundColor: colors.primary,
    },
    updateButtonDisabled: {
      backgroundColor: colors.divider,
    },
    buttonText: {
      ...typography.textStyles.body1,
      fontFamily: typography.fonts.inter.bold,
    },
    cancelButtonText: {
      color: colors.text,
    },
    updateButtonText: {
      color: colors.background,
    },
    updateButtonTextDisabled: {
      color: colors.textSecondary,
    },
    spacer: {
      height: metrics.spacing.lg,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 40 }} />
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Atualizar Status</Text>
              <Text style={styles.headerSubtitle}>
                Pedido {order.orderNumber}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Status Atual */}
            <View style={styles.section}>
              <View style={styles.currentStatusContainer}>
                <Text style={styles.currentStatusLabel}>Status Atual:</Text>
                <View style={styles.currentStatusBadge}>
                  <View style={styles.statusIndicator}>
                    <Animated.View style={styles.statusIndicatorPulse} />
                  </View>
                  <Text style={styles.currentStatusText}>
                    {getCurrentStatusLabel(order.status)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Seleção de Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Selecione o próximo status:
              </Text>
              <View style={styles.statusButtonsContainer}>
                {Object.entries(statusLabels).map(([status, label]) => {
                  const orderStatus = status as OrderStatus;
                  const isNext = nextStatuses.includes(orderStatus);
                  const isSelected = selectedStatus === orderStatus;
                  const isDisabled = !isNext;

                  return (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        isSelected
                          ? styles.statusButtonActive
                          : isDisabled
                          ? styles.statusButtonDisabled
                          : styles.statusButtonInactive,
                      ]}
                      onPress={() => isNext && handleStatusSelect(orderStatus)}
                      disabled={isDisabled}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          isSelected
                            ? styles.statusButtonTextActive
                            : styles.statusButtonTextInactive,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Observações */}
            <View style={styles.section}>
              <Text style={styles.notesLabel}>Observações (opcional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Adicione uma observação..."
                placeholderTextColor={colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                canUpdate ? styles.updateButton : styles.updateButtonDisabled,
              ]}
              onPress={handleUpdateStatus}
              disabled={!canUpdate}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.buttonText,
                  canUpdate
                    ? styles.updateButtonText
                    : styles.updateButtonTextDisabled,
                ]}
              >
                Atualizar Status
              </Text>
            </TouchableOpacity>
          </View>

          {/* Spacer for safe area */}
          <View style={styles.spacer} />
        </Animated.View>
      </View>
    </Modal>
  );
};
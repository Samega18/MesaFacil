import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './styles';

/**
 * Modal de confirmação reutilizável.
 */
export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: 'primary' | 'danger';
}

export const ConfirmationModal = React.memo<ConfirmationModalProps>(({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  confirmButtonColor = 'primary',
}) => {
  const { colors } = useTheme();

  /**
   * Recalcula apenas quando colors ou confirmButtonColor mudam.
   */
  const dynamicStyles = useMemo(() => ({
    modalOverlay: [styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }],
    modalContainer: [styles.modalContainer, { backgroundColor: colors.background }],
    title: [styles.title, { color: colors.text }],
    message: [styles.message, { color: colors.text }],
    cancelButton: [styles.cancelButton, { 
      backgroundColor: colors.background,
      borderColor: colors.divider,
    }],
    cancelButtonText: [styles.cancelButtonText, { color: colors.text }],
    confirmButton: [styles.confirmButton, { 
      backgroundColor: confirmButtonColor === 'danger' ? '#FF4444' : colors.primary 
    }],
    confirmButtonText: [styles.confirmButtonText, { color: 'white' }],
  }), [colors, confirmButtonColor]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={dynamicStyles.modalOverlay}>
        <View style={dynamicStyles.modalContainer}>
          {/* Título */}
          <Text style={dynamicStyles.title}>
            {title}
          </Text>

          {/* Mensagem */}
          <Text style={dynamicStyles.message}>
            {message}
          </Text>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={dynamicStyles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={dynamicStyles.cancelButtonText}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.confirmButton}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={dynamicStyles.confirmButtonText}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});
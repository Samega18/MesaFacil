import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Dish } from '../../types/models';
import { styles } from './styles';

interface DishModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dish: Partial<Dish>) => void;
  dish?: Dish | null; // null para criar, Prato para editar
}

const CATEGORIES = ['Entradas', 'Pratos Principais', 'Sobremesas', 'Bebidas'];

export const DishModal: React.FC<DishModalProps> = ({
  visible,
  onClose,
  onSave,
  dish = null,
}) => {
  const { colors, theme } = useTheme();
  const isEditing = dish !== null;

  // Estados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Contador de caracteres para descrição
  const descriptionLength = description.length;
  const maxDescriptionLength = 120;

  // Estilos dinâmicos baseados no tema
  const dynamicStyles = useMemo(() => ({
    modalOverlay: [styles.modalOverlay, { backgroundColor: `${colors.text}80` }],
    modalContainer: [styles.modalContainer, { backgroundColor: colors.background }],
    header: [styles.header, { borderBottomColor: colors.divider }],
    headerTitle: [styles.headerTitle, { color: colors.text }],
    closeButton: styles.closeButton,
    inputLabel: [styles.inputLabel, { color: colors.text }],
    textInput: [styles.textInput, { 
      backgroundColor: colors.background,
      borderColor: colors.divider,
      color: colors.text,
    }],
    textArea: [styles.textArea, { 
      backgroundColor: colors.background,
      borderColor: colors.divider,
      color: colors.text,
    }],
    priceContainer: styles.priceContainer,
    pricePrefix: [styles.pricePrefix, { color: colors.textSecondary }],
    priceInput: [styles.priceInput, { 
      backgroundColor: colors.background,
      borderColor: colors.divider,
      color: colors.text,
    }],
    characterCount: [styles.characterCount, { color: colors.textSecondary }],
    categorySelector: [styles.categorySelector, { 
      backgroundColor: colors.background,
      borderColor: colors.divider,
    }],
    categoryText: [styles.categoryText, { color: colors.text }],
    categoryPlaceholder: [styles.categoryPlaceholder, { color: colors.textSecondary }],
    categoryPicker: [styles.categoryPicker, { 
      backgroundColor: colors.background,
      borderColor: colors.divider,
    }],
    categoryOption: [styles.categoryOption, { borderBottomColor: colors.divider }],
    categoryOptionText: [styles.categoryOptionText, { color: colors.text }],
    buttonsContainer: styles.buttonsContainer,
    cancelButton: [styles.cancelButton, { backgroundColor: `${colors.primary}20` }],
    cancelButtonText: [styles.cancelButtonText, { color: colors.primary }],
    saveButton: [styles.saveButton, { backgroundColor: colors.primary }],
    saveButtonText: [styles.saveButtonText, { color: colors.background }],
  }), [colors, theme]);

  // Inicializar campos quando o modal abrir
  useEffect(() => {
    if (visible) {
      if (isEditing && dish) {
        setName(dish.name || '');
        setDescription(dish.description || '');
        setPrice((dish.price || 0).toFixed(2).replace('.', ','));
        setCategory(dish.category || '');
      } else {
        // Limpar campos para novo prato
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
      }
      setShowCategoryPicker(false);
    }
  }, [visible, dish, isEditing]);

  // Validação do formulário
  const isFormValid = useMemo(() => {
    return (
      name.trim().length > 0 &&
      description.trim().length > 0 &&
      description.length <= maxDescriptionLength &&
      price.trim().length > 0 &&
      category.length > 0 &&
      parseFloat(price.replace(',', '.')) > 0
    );
  }, [name, description, price, category]);

  // Formatação do preço
  const handlePriceChange = useCallback((text: string) => {
    // Remove caracteres não numéricos exceto vírgula
    const numericText = text.replace(/[^0-9,]/g, '');
    
    // Garante apenas uma vírgula
    const parts = numericText.split(',');
    if (parts.length > 2) {
      const formatted = parts[0] + ',' + parts.slice(1).join('');
      setPrice(formatted);
    } else {
      setPrice(numericText);
    }
  }, []);

  // Salvar prato
  const handleSave = useCallback(() => {
    if (!isFormValid) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    const dishData: Partial<Dish> = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price.replace(',', '.')),
      category: category as any,
    };

    if (isEditing && dish) {
      dishData.id = dish.id;
    }

    onSave(dishData);
    onClose();
  }, [isFormValid, name, description, price, category, isEditing, dish, onSave, onClose]);

  // Selecionar categoria
  const handleCategorySelect = useCallback((selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowCategoryPicker(false);
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={dynamicStyles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={dynamicStyles.modalContainer}>
          {/* Header */}
          <View style={dynamicStyles.header}>
            <View style={{ width: 40 }} />
            <Text style={dynamicStyles.headerTitle}>
              {isEditing ? 'Editar Prato' : 'Novo Prato'}
            </Text>
            <TouchableOpacity
              style={dynamicStyles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
            {/* Nome do prato */}
            <View style={styles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Nome do prato</Text>
              <TextInput
                style={dynamicStyles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Salada de Frutas"
                placeholderTextColor={colors.textSecondary}
                maxLength={100}
              />
            </View>

            {/* Descrição curta */}
            <View style={styles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Descrição curta</Text>
              <TextInput
                style={dynamicStyles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Ex: Uma deliciosa salada com frutas frescas da estação"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                maxLength={maxDescriptionLength}
                textAlignVertical="top"
              />
              <Text style={dynamicStyles.characterCount}>
                {descriptionLength}/{maxDescriptionLength}
              </Text>
            </View>

            {/* Preço */}
            <View style={styles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Preço</Text>
              <View style={dynamicStyles.priceContainer}>
                <Text style={dynamicStyles.pricePrefix}>R$</Text>
                <TextInput
                  style={dynamicStyles.priceInput}
                  value={price}
                  onChangeText={handlePriceChange}
                  placeholder="0,00"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Categoria */}
            <View style={styles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Categoria</Text>
              <TouchableOpacity
                style={dynamicStyles.categorySelector}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                activeOpacity={0.7}
              >
                <Text style={category ? dynamicStyles.categoryText : dynamicStyles.categoryPlaceholder}>
                  {category || 'Selecione uma categoria'}
                </Text>
                <Feather 
                  name={showCategoryPicker ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {/* Category Picker */}
              {showCategoryPicker && (
                <View style={dynamicStyles.categoryPicker}>
                  {CATEGORIES.map((cat, index) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        dynamicStyles.categoryOption,
                        index === CATEGORIES.length - 1 && { borderBottomWidth: 0 }
                      ]}
                      onPress={() => handleCategorySelect(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={dynamicStyles.categoryOptionText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Espaçamento extra para o teclado */}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Buttons */}
          <View style={dynamicStyles.buttonsContainer}>
            <TouchableOpacity
              style={dynamicStyles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={dynamicStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                dynamicStyles.saveButton,
                !isFormValid && { opacity: 0.5 }
              ]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={!isFormValid}
            >
              <Text style={dynamicStyles.saveButtonText}>
                {isEditing ? 'Salvar Prato' : 'Criar Prato'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
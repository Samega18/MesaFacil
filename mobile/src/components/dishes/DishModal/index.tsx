import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dish, DishCategory } from '../../../types/models';
import { CreateDishRequest, UpdateDishRequest } from '../../../types/api';
import { useTheme } from '../../../contexts/ThemeContext';
import { createStyles } from './styles';

interface DishModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dishData: CreateDishRequest | UpdateDishRequest) => Promise<void>;
  dish?: Dish | null;
}

const DishModal: React.FC<DishModalProps> = ({
  visible,
  onClose,
  onSave,
  dish,
}) => {
  const { colors } = useTheme();
  
  // Estados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<DishCategory>('APPETIZER');
  const [image, setImage] = useState('');
  const [loading, setSaving] = useState(false);

  // Estilos dinâmicos baseados no tema
  const styles = createStyles(colors);

  // Inicializar campos quando o modal abrir ou o prato mudar
  useEffect(() => {
    if (visible) {
      if (dish) {
        // Modo edição - preencher com dados do prato
        setName(dish.name);
        setDescription(dish.description);
        setPrice(dish.price.toString());
        setCategory(dish.category);
        setImage(dish.image || '');
      } else {
        // Modo criação - limpar campos
        setName('');
        setDescription('');
        setPrice('');
        setCategory('APPETIZER');
        setImage('');
      }
    }
  }, [visible, dish]);

  // Validação do formulário
  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      description.trim() !== '' &&
      price.trim() !== '' &&
      !isNaN(parseFloat(price)) &&
      parseFloat(price) > 0 &&
      category !== null && category !== undefined
    );
  };

  // Formatação do preço
  const formatPrice = (value: string) => {
    // Remove caracteres não numéricos exceto ponto e vírgula
    const numericValue = value.replace(/[^0-9.,]/g, '');
    // Substitui vírgula por ponto para padronização
    return numericValue.replace(',', '.');
  };

  // Função para salvar o prato
  const handleSave = async () => {
    if (!isFormValid()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const dishData = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(formatPrice(price)),
        category,
        image: image.trim() || '', // Deixa vazio para usar o fallback do FallbackImage
        active: true,
      };

      await onSave(dishData);
      // Se chegou até aqui, o prato foi salvo com sucesso
      onClose(); // Fechar o modal
    } catch (error) {
      // O erro já foi tratado no hook useDishManagement com Alert.alert
      // Apenas registramos no console para debug
      console.error('Erro ao salvar prato:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {dish ? 'Editar Prato' : 'Novo Prato'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {/* Campo Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Prato *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Hambúrguer Artesanal"
                placeholderTextColor={colors.textSecondary}
                maxLength={100}
              />
            </View>

            {/* Campo Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva os ingredientes e características do prato..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>

            {/* Campo Preço */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preço *</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={(value) => setPrice(formatPrice(value))}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>

            {/* Campo Categoria */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Entrada" value="APPETIZER" />
                  <Picker.Item label="Prato Principal" value="MAIN_COURSE" />
                  <Picker.Item label="Sobremesa" value="DESSERT" />
                  <Picker.Item label="Bebida" value="DRINK" />
                </Picker>
              </View>
            </View>

            {/* Campo Imagem */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL da Imagem</Text>
              <TextInput
                style={styles.input}
                value={image}
                onChangeText={setImage}
                placeholder="https://exemplo.com/imagem.jpg"
                placeholderTextColor={colors.textSecondary}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.helperText}>
                Deixe em branco para usar uma imagem padrão
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botão Salvar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!isFormValid() || loading) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!isFormValid() || loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Salvando...' : dish ? 'Salvar Alterações' : 'Criar Prato'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default DishModal;
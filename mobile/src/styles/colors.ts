/**
 * @file Contém a paleta de cores da aplicação, com suporte a temas claro e escuro.
 */

// Cores que são comuns a ambos os temas (light/dark)
const common = {
  primary: '#E53935', // Vermelho Tomate
  secondary: '#43A047', // Verde Abacate
  
  feedback: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },

  status: {
    recebido: '#2196F3', // Azul
    emPreparo: '#FFC107', // Amarelo
    pronto: '#43A047', // Verde
    entregue: '#9E9E9E', // Cinza
  },
};

// Tema Claro
export const lightColors = {
  ...common,
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  divider: '#E0E0E0',
};

// Tema Escuro
export const darkColors = {
  ...common,
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#BDBDBD',
  divider: '#424242', // Um cinza escuro para divisores no modo escuro
};

export const colors = lightColors;
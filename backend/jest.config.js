module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',

  // Padrão para encontrar arquivos de teste
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Arquivos de setup que rodam antes dos testes
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/database/seeds/**',
    '!src/database/prisma.js',
    '!src/__tests__/**'
  ],

  // Diretório de saída da cobertura
  coverageDirectory: 'coverage',

  // Formatos de relatório de cobertura
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Limites de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Limpar mocks automaticamente entre testes
  clearMocks: true,

  // Mostrar cada teste individual
  verbose: true,

  // Timeout para testes (10 segundos)
  testTimeout: 10000
};
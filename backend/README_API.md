# MesaFácil - Backend API

## 📋 Visão Geral

O backend do **MesaFácil** é uma API REST robusta desenvolvida em Node.js para gerenciar operações de um restaurante, incluindo cardápio de pratos e pedidos. A aplicação foi construída seguindo princípios de arquitetura limpa e boas práticas de desenvolvimento.

## 🏗️ Arquitetura

### Estrutura Modular
A aplicação segue uma arquitetura modular organizada por domínios:

```
src/
├── modules/
│   ├── dishes/          # Módulo de pratos
│   │   ├── dishes.controller.js
│   │   ├── dishes.service.js
│   │   └── dishes.routes.js
│   └── orders/          # Módulo de pedidos
│       ├── orders.controller.js
│       ├── orders.service.js
│       └── orders.routes.js
├── middlewares/         # Middlewares de validação
├── database/           # Configuração do banco e seeds
└── routes/            # Roteamento principal
```

### Padrão MVC
- **Controllers**: Gerenciam requisições HTTP e respostas
- **Services**: Contêm a lógica de negócio
- **Routes**: Definem endpoints e aplicam middlewares

## 🛠️ Tecnologias Utilizadas

### Core
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados relacional

### Segurança e Validação
- **Helmet** - Proteção de cabeçalhos HTTP
- **CORS** - Controle de acesso entre origens
- **Express Validator** - Validação de dados de entrada
- **Zod** - Schema validation

### Documentação
- **Swagger/OpenAPI** - Documentação interativa da API
- **Swagger UI Express** - Interface web para documentação

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP
- **Cobertura de código** configurada

### DevOps
- **Docker** - Containerização
- **Nodemon** - Hot reload em desenvolvimento

## 📊 Modelo de Dados

### Entidades Principais

#### Dish (Prato)
```prisma
model Dish {
  id          String       @id @default(uuid())
  name        String       @unique
  description String
  price       Decimal
  category    DishCategory
  active      Boolean      @default(true)
  image       String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  orderItems  OrderItem[]
}
```

#### Order (Pedido)
```prisma
model Order {
  id         String      @id @default(uuid())
  totalValue Decimal
  status     OrderStatus @default(RECEIVED)
  notes      String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  items      OrderItem[]
}
```

#### OrderItem (Item do Pedido)
```prisma
model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  dishId    String
  quantity  Int
  unitPrice Decimal
  subtotal  Decimal
  dish      Dish    @relation(fields: [dishId], references: [id])
  order     Order   @relation(fields: [orderId], references: [id])
}
```

### Enums

#### Categorias de Pratos
- `APPETIZER` - Entrada
- `MAIN_COURSE` - Prato Principal
- `DESSERT` - Sobremesa
- `DRINK` - Bebida

#### Status de Pedidos
- `RECEIVED` - Recebido
- `PREPARING` - Preparando
- `READY` - Pronto
- `DELIVERED` - Entregue

## 🔌 Endpoints da API

### Pratos (`/api/dishes`)
- `GET /dishes` - Listar todos os pratos
- `GET /dishes/:id` - Buscar prato por ID
- `POST /dishes` - Criar novo prato
- `PUT /dishes/:id` - Atualizar prato
- `DELETE /dishes/:id` - Remover prato

### Pedidos (`/api/orders`)
- `GET /orders` - Listar todos os pedidos
- `GET /orders/:id` - Buscar pedido por ID
- `POST /orders` - Criar novo pedido
- `PUT /orders/:id` - Atualizar pedido completo
- `PATCH /orders/:id/status` - Atualizar apenas status
- `DELETE /orders/:id` - Cancelar pedido

## 🔒 Validações e Middlewares

### Validação de Dados
- **Pratos**: Nome único, preço positivo, categoria válida
- **Pedidos**: Itens obrigatórios, quantidades positivas, pratos existentes
- **UUIDs**: Validação de formato para IDs

### Middlewares de Segurança
- **Helmet**: Proteção contra vulnerabilidades comuns
- **CORS**: Configurado para permitir requisições do frontend
- **Express Async Errors**: Tratamento automático de erros assíncronos

### Tratamento de Erros
Sistema centralizado de tratamento de erros com:
- Status codes apropriados
- Mensagens descritivas
- Logging para debugging

## 📚 Documentação da API

A API possui documentação interativa gerada automaticamente com **Swagger/OpenAPI**, acessível em:
```
http://localhost:3000/api-docs
```

A documentação inclui:
- Schemas detalhados de todas as entidades
- Exemplos de requisições e respostas
- Códigos de status HTTP
- Parâmetros obrigatórios e opcionais

## 🧪 Testes

### Estrutura de Testes
```
src/__tests__/
├── setup.js                    # Configuração global
├── dishes.controller.test.js   # Testes do controller de pratos
├── dishes.service.test.js      # Testes do service de pratos
├── orders.controller.test.js   # Testes do controller de pedidos
└── orders.service.test.js      # Testes do service de pedidos
```

### Cobertura de Código
- **Configuração**: Jest com relatórios HTML, LCOV e JSON
- **Métricas**: Cobertura de linhas, funções, branches e statements
- **Exclusões**: Arquivos de configuração e seeds

### Scripts de Teste
```bash
npm test              # Executar todos os testes
npm run test:watch    # Executar testes em modo watch
npm run test:coverage # Executar testes com relatório de cobertura
```

## 🗄️ Banco de Dados

### Prisma ORM
- **Migrations**: Controle de versão do schema
- **Seeds**: Dados iniciais para desenvolvimento
- **Client Generation**: Tipagem automática TypeScript-like

### Seeds Disponíveis
```bash
npm run seed         # Executar todos os seeds
npm run seed:dishes  # Seed específico para pratos
```

## 🐳 Docker

### Containerização
- **Base Image**: `node:18-alpine` (otimizada para produção)
- **Multi-stage**: Otimização de tamanho da imagem
- **Prisma**: Geração automática do client no build

### Configuração
- **Porta**: 3000 (exposta)
- **Workdir**: `/usr/src/app`
- **Volumes**: Suporte para desenvolvimento

## 📁 Estrutura de Arquivos

```
backend/
├── src/
│   ├── modules/           # Módulos da aplicação
│   ├── middlewares/       # Middlewares customizados
│   ├── database/          # Configuração do banco
│   ├── routes/           # Roteamento principal
│   ├── __tests__/        # Testes automatizados
│   ├── app.js            # Configuração do Express
│   └── server.js         # Inicialização do servidor
├── prisma/
│   ├── schema.prisma     # Schema do banco de dados
│   └── migrations/       # Migrações do banco
├── coverage/             # Relatórios de cobertura
├── Dockerfile           # Configuração Docker
├── jest.config.js       # Configuração de testes
└── package.json         # Dependências e scripts
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente
Consulte o arquivo `.env.example` para as variáveis necessárias:
- `DATABASE_URL` - String de conexão PostgreSQL
- `PORT` - Porta do servidor (padrão: 3000)

## 🚀 Características Técnicas

### Performance
- **Async/Await**: Operações assíncronas otimizadas
- **Connection Pooling**: Gerenciamento eficiente de conexões
- **Indexação**: Índices otimizados no banco de dados

### Escalabilidade
- **Arquitetura Modular**: Fácil adição de novos módulos
- **Separação de Responsabilidades**: Controllers, Services e Routes
- **Containerização**: Deploy facilitado com Docker

### Manutenibilidade
- **Código Limpo**: Seguindo princípios SOLID
- **Testes Automatizados**: Cobertura abrangente
- **Documentação**: API documentada com Swagger
- **Validações**: Entrada de dados sempre validada

---

**Nota**: Esta documentação reflete o estado atual do projeto API backend. Para informações sobre Frontend - Mobile, consulte a documentação específica do Mobile.
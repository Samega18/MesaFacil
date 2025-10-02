FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de definição de pacotes
COPY package*.json ./

COPY prisma ./prisma/

# Instala as dependências da aplicação
RUN npm install

# Copia todo o resto do código da sua aplicação para o diretório de trabalho
COPY . .

# Gera o Prisma Client após copiar todos os arquivos
RUN npx prisma generate

# Expõe a porta 3000, que é a porta que a nossa API vai usar
EXPOSE 3000
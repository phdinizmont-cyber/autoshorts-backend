FROM node:18

# Instalar FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Criar pasta do app
WORKDIR /app

# Copiar arquivos
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar resto do código
COPY . .

# Expor porta
EXPOSE 3000

# Rodar app
CMD ["node", "server.js"]

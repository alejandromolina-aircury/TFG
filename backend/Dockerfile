
FROM node:22-slim

WORKDIR /app

# Instalamos OpenSSL (necesario para Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el código
COPY . .

# Generamos el cliente (con variable dummy para que no falle)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

EXPOSE 4000

# Comando de arranque
CMD ["npm", "run", "dev"]
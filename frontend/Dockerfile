FROM node:22-alpine

WORKDIR /app

# Copiamos package.json si existe
COPY package*.json ./

# Si existe package.json, instalamos. Si no, no hace nada (para evitar errores iniciales)
RUN if [ -f package.json ]; then npm install; fi

COPY . .

# Puertos para Vite (5173) y React/Next estándar (3000)
EXPOSE 5173 3000

CMD ["sh", "-c", "if [ -f package.json ]; then npm install && npm run dev -- --host; else echo 'Esperando creación de proyecto...' && tail -f /dev/null; fi"]
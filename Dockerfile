# Multi-stage build для React + Vite приложения

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходники
COPY . .

# Собираем production build
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Копируем nginx конфигурацию
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose порт для Cloud Run
EXPOSE 8080

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]


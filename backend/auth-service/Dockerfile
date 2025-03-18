# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости ТОЛЬКО внутри контейнера
RUN npm ci

# Копируем весь код (кроме node_modules)
COPY . .

# Компилируем TypeScript
RUN npm run build

# Указываем переменные окружения
ENV PORT=3001
ENV NODE_ENV=production

# Открываем порт
EXPOSE 3001

# Запускаем приложение
CMD ["node", "dist/main.js"]


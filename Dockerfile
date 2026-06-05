FROM node:18-alpine

# Устанавливаем зависимости для сборки нативных модулей (нужны только если есть пакеты вроде node-sass, sharp, bcrypt)
# Если у вас чистый React/Vue/Next.js без таких зависимостей, эту строку можно удалить для ускорения сборки.
RUN apk add --no-cache python3 make g++ gcc libc-dev

WORKDIR /app

# Копируем ТОЛЬКО файлы манифестов (package.json и package-lock.json)
# Это позволяет Docker закешировать слой с зависимостями и не переустанавливать их при каждом изменении кода
COPY package*.json ./

# Чистая установка (Clean Install). Строго следует package-lock.json
RUN npm ci --legacy-peer-deps

# Копируем весь исходный код приложения
COPY . .

# !!! ВАЖНО: Если вы используете Next.js, Nuxt или другой фреймворк, требующий сборки:
# Раскомментируйте следующую строку, чтобы собрать оптимизированный продакшен-билд перед запуском
# RUN npm run build

EXPOSE 3000

# Запуск приложения (для Next.js это обычно "start", для Vite/CRA в dev-режиме тоже может быть "start")
CMD ["npm", "start"]
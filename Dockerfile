# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files trước để tận dụng cache
COPY tailwindcss4/package.json tailwindcss4/package-lock.json ./
RUN npm install --no-audit --no-fund

# Copy .env để Vite lấy được biến
COPY tailwindcss4/.env ./

# Copy toàn bộ source code
COPY tailwindcss4/ ./

# Build React app
RUN npm run build


# --- Runtime stage ---
FROM nginx:1.27-alpine AS runtime

# Nginx config for Vite/React SPA (history API fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output sang Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

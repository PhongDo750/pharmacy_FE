# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY tailwindcss4/package.json tailwindcss4/package-lock.json ./
RUN npm install --no-audit --no-fund

# Copy the rest of the source and build
COPY tailwindcss4/ ./
RUN npm run build


# --- Runtime stage ---
FROM nginx:1.27-alpine AS runtime

# Nginx config for Vite/React SPA (history API fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5713
CMD ["nginx", "-g", "daemon off;"]



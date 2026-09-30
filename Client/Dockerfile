# ==========================================
# Angular 19 Client - Production Dockerfile
# ==========================================

# 1. Build Stage
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build -- --configuration=production

# 2. Web Server Stage (Nginx)
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy built Angular files (Angular 19 application builder outputs to browser subfolder)
COPY --from=build /app/dist/Client/browser .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

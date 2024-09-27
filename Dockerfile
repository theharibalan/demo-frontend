# Stage 1: Build React app
FROM node:alpine3.18 as build

# Declare build time environment variables
ARG REACT_APP_NODE_ENV
ARG REACT_APP_SERVER_BASE_URL

# Set default values for environment variables
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL

# Build App
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.23-alpine

# Install OpenSSL for generating self-signed certificate (optional for dev)
RUN apk add --no-cache openssl

# Create a self-signed SSL certificate for development (skip in production)
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx-selfsigned.key \
    -out /etc/nginx/ssl/nginx-selfsigned.crt \
    -subj "/CN=localhost"

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Remove default Nginx static assets
WORKDIR /usr/share/nginx/html
RUN rm -rf *

# Copy built React app from build stage
COPY --from=build /app/build .

# Expose port 443 for HTTPS
EXPOSE 443

# Start Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]

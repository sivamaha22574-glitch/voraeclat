# ==========================================
# Voraeclat Backend - Node.js Production Image
# ==========================================
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package definitions
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend application source code
COPY . .

# Set default production environment
ENV NODE_ENV=production \
    PORT=5000

# Expose Express server port
EXPOSE 5000

# Healthcheck to verify server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/products?limit=1 || exit 1

# Launch production server
CMD ["node", "server.js"]

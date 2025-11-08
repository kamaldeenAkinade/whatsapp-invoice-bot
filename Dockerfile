# Use Node.js 16 with all the needed tools
FROM node:16-bullseye

# Set working directory
WORKDIR /app

# Install latest Chromium package
RUN apt-get update \
    && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-noto-color-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

# Create necessary directories and set permissions
RUN mkdir -p /app/.wwebjs_auth/session-client \
    && mkdir -p /app/invoices \
    && chown -R node:node /app

# Copy package files first for better caching
COPY --chown=node:node package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY --chown=node:node . .

# Switch to non-root user for security
USER node

# Command to run the application
CMD ["node", "index.js"]

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Start the bot
CMD ["npm", "start"]
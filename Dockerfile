# Use Node.js 16 as base image (more stable for Puppeteer)
FROM node:16-buster-slim

# Set working directory
WORKDIR /app

# Install required dependencies
RUN apt-get update \
    && apt-get install -y \
    chromium \
    libgbm1 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libasound2 \
    fonts-noto-color-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create and set permissions for WhatsApp session data
RUN mkdir -p /app/.wwebjs_auth/session-client \
    && chown -R node:node /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Switch to non-root user
USER node

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Start the bot
CMD ["npm", "start"]
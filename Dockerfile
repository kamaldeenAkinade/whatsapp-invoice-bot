# Use Ubuntu as base image
FROM ubuntu:20.04

# Prevent tzdata questions
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Install Chrome dependencies and other required packages
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    chromium-browser \
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
    libgbm1 \
    libasound2 \
    fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create directory for WhatsApp session data
RUN mkdir -p /app/.wwebjs_auth/session-client

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Start the bot
CMD ["npm", "start"]
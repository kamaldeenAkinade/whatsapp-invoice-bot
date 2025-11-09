FROM node:16-slim

WORKDIR /app

# Install latest Chromium package
RUN apt-get update \
    && apt-get install -y chromium \
    fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/.wwebjs_auth/session-client \
    && mkdir -p /app/invoices

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy rest of the application
COPY . .

# Create a non-root user
RUN useradd -r -s /bin/false appuser \
    && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Start the bot
CMD ["node", "index.js"]

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Start the bot
CMD ["npm", "start"]
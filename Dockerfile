FROM ghcr.io/puppeteer/puppeteer:19.7.0

USER root

WORKDIR /app

# Install dependencies for running WhatsApp
RUN apt-get update \
    && apt-get install -y \
    fonts-noto-color-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /app/.wwebjs_auth/session-client \
    && mkdir -p /app/invoices \
    && chown -R pptruser:pptruser /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set ownership
RUN chown -R pptruser:pptruser /app

# Switch to non-root user
USER pptruser

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
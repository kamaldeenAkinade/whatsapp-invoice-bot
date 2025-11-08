FROM node:16

WORKDIR /app

# Install Chromium and other dependencies
RUN apt-get update \
    && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-noto-color-emoji \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Create a non-root user
RUN useradd -m -d /app whatsapp-bot \
    && mkdir -p /app/.wwebjs_auth/session-client \
    && mkdir -p /app/invoices \
    && chown -R whatsapp-bot:whatsapp-bot /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set correct permissions
RUN chown -R whatsapp-bot:whatsapp-bot /app

# Switch to non-root user
USER whatsapp-bot

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
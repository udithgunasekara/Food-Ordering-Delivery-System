FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Expose port from environment variable
EXPOSE ${SERVER_PORT}

# Run the application
CMD ["node", "src/app.js"]
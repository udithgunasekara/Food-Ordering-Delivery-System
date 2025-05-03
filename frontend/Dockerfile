# Use Node.js LTS as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app (uncomment for production build)
# RUN npm run build

# Expose the port Vite uses by default
EXPOSE 5173

# Start the development server
CMD ["npm", "start"]
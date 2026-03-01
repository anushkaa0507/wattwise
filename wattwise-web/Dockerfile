# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build React app
RUN npm run build

# Install serve to host build
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start frontend
CMD ["serve", "-s", "dist", "-l", "3000"]
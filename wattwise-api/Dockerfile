# Use official Node image
FROM node:20

# Create app directory inside container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]
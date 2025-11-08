# Stage 1: Use Node as the base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose backend port (e.g. 5000)
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]

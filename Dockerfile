# Use an official Node.js runtime as a parent image




# Stage 1: Build the application with dev dependencies
FROM node:18-alpine AS builder

RUN apk add --no-cache g++ make py3-pip libc6-compat

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install both production and dev dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the application (TypeScript types are required here)
RUN npm run build

# Stage 2: Production environment (only production dependencies)
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files for runtime
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --production

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "start"]

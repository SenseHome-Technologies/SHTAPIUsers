# Build stage
FROM node:20.18-slim as builder

# Set the working directory inside the container
WORKDIR /app

# Install app dependencies
COPY package*.json ./
#RUN npm install
# Optimized for production (no dev dependencies)
RUN npm ci --only=production

# Copy the application source code and environment file
COPY src ./src/
COPY public ./public/
COPY .env .

# Runtime stage 
FROM node:20.18-alpine as runtime

# Set the working directory inside the container
WORKDIR /app

# Copy the application from the builder stage
COPY --from=builder /app /app

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "./src/app.js"]
FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 8080

# Serve the built app (Render sets PORT env var)
CMD ["sh", "-c", "serve -s dist -l ${PORT:-8080}"]

FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the app (Vite embeds env vars at build time)
# ARG allows passing build-time variables
ARG VITE_PRIVY_APP_ID
ARG VITE_CONTRACT_ADDRESS
ENV VITE_PRIVY_APP_ID=${VITE_PRIVY_APP_ID}
ENV VITE_CONTRACT_ADDRESS=${VITE_CONTRACT_ADDRESS}

RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 8080

# Serve the built app (Render sets PORT env var)
CMD ["sh", "-c", "serve -s dist -l ${PORT:-8080}"]

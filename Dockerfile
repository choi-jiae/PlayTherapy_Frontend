# Stage 1: Building the code
FROM node:16-alpine AS builder

WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files first to install dependencies
COPY package.json package-lock.json* yarn.lock* ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Running the code
FROM node:16-alpine

WORKDIR /app

# Copy the build output from the previous stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.alpha ./.env.alpha
COPY --from=builder /app/.env.release ./.env.release

# Expose the port Next.js runs on
EXPOSE 3000

# Set the command to start the Next.js server
CMD ["npm", "start"]
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy source files
COPY . .

# Build the app — allow passing NEXT_PUBLIC_STAGE at build time
ARG NEXT_PUBLIC_STAGE
ENV NEXT_PUBLIC_STAGE=$NEXT_PUBLIC_STAGE
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

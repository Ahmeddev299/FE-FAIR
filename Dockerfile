# 1. Use Node.js base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Accept build-time environment variable
ARG NEXT_PUBLIC_STAGE
ENV NEXT_PUBLIC_STAGE=$NEXT_PUBLIC_STAGE

# 4. Copy package.json and lock file
COPY package*.json ./

# 5. Install dependencies
RUN npm install

# 6. Copy the rest of the app
COPY . .

# 7. Build the Next.js app
RUN npm run build

# 8. Expose port
EXPOSE 3000

# 9. Start the app
CMD ["npm", "start"]


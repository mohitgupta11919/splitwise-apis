# Use Node.js LTS as base
FROM node:14

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]

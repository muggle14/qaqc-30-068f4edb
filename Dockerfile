# Use Node.js LTS as the base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files to the container
COPY ["package.json", "package-lock.json*", "./"]

# Install dependencies, including devDependencies
ENV NODE_ENV=development
RUN npm install --silent

# Copy the application code into the container
COPY . .

# Build the application for production
RUN npm run build

# Set NODE_ENV to production for runtime
ENV NODE_ENV=production

# Expose the port used by the Vite preview server
EXPOSE 4173

# Set the command to start the production server
CMD ["npm", "run", "preview"]

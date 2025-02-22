# ------------ STAGE 1: Build with Node ------------
    FROM node:18 AS build

    # Set the working directory
    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy the rest of your source code
    COPY . .
    
    # Build the React app
    RUN npm run build
    
    # ------------ STAGE 2: Serve with NGINX ------------
    FROM nginx:alpine
    
    # Expose port 8080 for Azure (or local Docker)
    EXPOSE 8080
    
    # Remove the default Nginx config
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Copy your custom default.conf into Nginx
    # Assuming default.conf is in the same directory as this Dockerfile
    COPY default.conf /etc/nginx/conf.d/default.conf
    
    # Copy the React build artifacts from Stage 1 to Nginx's html folder
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Start Nginx in the foreground
    CMD ["nginx", "-g", "daemon off;"]
    
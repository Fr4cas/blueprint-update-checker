# Using node:22.2.0 as closest available to v22.16.0
FROM node:22.2.0 AS build

# Goes to the app directory
WORKDIR /app

# Copy client package.json and package-lock.json
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client folder
COPY client ./

# Build the react app
RUN npm run build

# Serve frontend with a static server
FROM node:22.2.0

WORKDIR /app

# Install "serve" globally to serve the static files
RUN npm install -g serve

# Copy the react build output
COPY --from=build /app/build ./build

# Expose the port
EXPOSE 3000

# Serve the build folder
CMD ["serve", "-s", "build"]
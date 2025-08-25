# Using node:22.2.0 as closest available to v22.16.0
FROM node:22.2.0

# Goes to the app directory
WORKDIR /app

# Copy server package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server folder
COPY server ./

# TODO: Set port variable (come back to this when switch process.env.port)
#ENV PORT=5000

# Expose the port
EXPOSE 5000

# Run
CMD ["node", "index.js"]
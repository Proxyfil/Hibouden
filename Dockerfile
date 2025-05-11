# Create container with the discord bot in it

# Use the official image as a parent image
FROM node:19.6.1

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install the required packages
RUN npm install

CMD ["node", "./src/scripts/main.js"]

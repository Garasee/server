# Set the base image
FROM node:20-alpine

# Install Yarn
RUN apk add --no-cache yarn

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package*.json yarn.lock ./

# Install the dependencies
RUN yarn

# Copy the rest of the application to the container
COPY . .

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

RUN yarn prisma migrate deploy

RUN yarn test-all

RUN yarn build

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
FROM node:16.14

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Copy portal files
COPY --from=ghcr.io/fides-uu/trustseco-portal:latest /dist ./public

EXPOSE 3000

RUN mkdir -p dist

CMD [ "npm", "run", "start" ]


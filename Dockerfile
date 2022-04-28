FROM node:12.22.9

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Copy portal files
COPY --from=ghcr.io/fides-uu/trustseco-portal:latest /dist ./public

EXPOSE 3000

CMD [ "npm", "run", "start" ]


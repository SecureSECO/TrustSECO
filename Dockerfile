FROM node:16.14

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
COPY --chown=node:node package*.json ./
RUN npm install

# Bundle app source
COPY --chown=node:node . .

# Copy portal files
COPY --from=ghcr.io/fides-uu/trustseco-portal:latest /dist ./public

EXPOSE 3000

# Setup user
USER node

RUN mkdir -p dist

CMD [ "npm", "run", "start" ]


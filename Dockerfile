FROM node:16.15.0

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

CMD [ "npm", "run", "start" ]

# Setup user
USER node


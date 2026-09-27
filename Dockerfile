FROM node:22-bookworm
WORKDIR /app
COPY package.json tsconfig.base.json tsconfig.json ./
COPY package ./package
COPY migrations ./migrations
COPY scripts ./scripts
RUN apt-get update \
 && apt-get install --no-install-recommends --yes postgresql-client \
 && rm -rf /var/lib/apt/lists/*
RUN npm install
RUN npm run build:server
EXPOSE 5174
CMD ["npm", "run", "start:server"]

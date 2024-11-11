FROM node:20.17.0 AS app-dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:20.17.0 AS app-prod-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.17.0 AS app-prod
WORKDIR /app
COPY --from=app-prod-builder /app ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]

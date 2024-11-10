FROM node:lts AS app-dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:lts AS app-prod-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts AS app-prod
WORKDIR /app
COPY --from=app-prod-builder /app ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]

FROM node:20.17.0 AS app-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.17.0 AS app
WORKDIR /app
COPY --from=app-builder /app ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]

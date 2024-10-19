FROM golang:bullseye AS api-builder
WORKDIR /app
COPY api/go.mod api/go.sum ./
RUN go mod download
COPY api/ .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o goapp .

FROM alpine:latest AS api
WORKDIR /app
COPY api/ .
COPY --from=api-builder /app/goapp .
EXPOSE 8080
CMD ["./goapp"]

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
RUN npm install --production
COPY . .
RUN npm run build

FROM node:lts AS app-prod
WORKDIR /app
COPY --from=app-prod-builder /app ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]

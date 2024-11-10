FROM golang:1.23.1 AS api-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o goapp .

FROM alpine:latest AS api
WORKDIR /app
COPY . .
COPY --from=api-builder /app/goapp .
EXPOSE 8080
CMD ["./goapp"]
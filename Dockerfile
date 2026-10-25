# Builds the Angular site and the Go server into one small image.
# Used by Render (or any Docker host). The server listens on $PORT.

FROM node:24-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npx ng build

FROM golang:1.27-alpine AS backend
WORKDIR /app/backend
COPY backend/go.mod ./
COPY backend/*.go ./
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /server .

FROM alpine:3.22
WORKDIR /app
COPY --from=backend /server ./server
COPY --from=frontend /app/frontend/dist/frontend/browser ./public
ENV STATIC_DIR=/app/public \
    DATA_DIR=/app/data \
    PORT=8080
EXPOSE 8080
CMD ["./server"]

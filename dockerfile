# ---------- build stage ----------
FROM node:25-alpine AS build

WORKDIR /app
COPY . .

ENV BACKEND_HOST=http://web4:9080

RUN npm install && npm run build

# ---------- runtime stage ----------
FROM gcr.io/distroless/nodejs:18

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

EXPOSE 3000

CMD ["build/index.js"]
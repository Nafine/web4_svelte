# ---------- build stage ----------
FROM node:25-alpine AS build

WORKDIR /app
COPY . .

RUN npm install && npm run build

# ---------- runtime stage ----------
FROM gcr.io/distroless/nodejs:18

ENV BACKEND_HOST=http://web4:9080
ENV PORT=3000

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

CMD ["build/index.js"]
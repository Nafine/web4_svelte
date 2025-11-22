FROM node:25

COPY . ./server

WORKDIR server

ENV BACKEND_HOST=http://web4:9080

RUN npm install && npm run build

EXPOSE 3000

CMD ["node", "build"]
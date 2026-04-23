FROM node:18
WORKDIR /app
COPY ./shared ./shared
COPY ./api_product/package*.json ./api_product/
WORKDIR /app/api_product
RUN npm install
COPY ./api_product .
EXPOSE 3000
CMD ["node", "server.js"]

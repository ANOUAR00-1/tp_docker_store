FROM node:18
WORKDIR /app
COPY ./shared ./shared
COPY ./api_command/package*.json ./api_command/
WORKDIR /app/api_command
RUN npm install
COPY ./api_command .
EXPOSE 3000
CMD ["node", "server.js"]

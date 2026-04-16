# Image officielle Node
FROM node:18

# Dossier de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["node", "server.js"]
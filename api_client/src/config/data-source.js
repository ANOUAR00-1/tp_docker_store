import "reflect-metadata" // Nécessaire pour TypeORM (utilise les decorators TypeScript)
import { DataSource } from "typeorm" // Classe principale pour configurer la connexion DB
import dotenv from "dotenv" // Permet de charger les variables d’environnement depuis .env
dotenv.config() // Charge les variables définies dans le fichier .env
export const AppDataSource = new DataSource({
 type: "mysql", // Type de base de données utilisée (ici MySQL)
 host: process.env.DB_HOST, // Adresse du serveur MySQL (ex: localhost ou IP)
 port: process.env.DB_PORT, // Port de connexion (devrait être un number → parseInt recommandé)
 username: process.env.DB_USER, // Nom d'utilisateur MySQL
 password: process.env.DB_PASS, // Mot de passe MySQL
 database: process.env.DB_NAME, // Nom de la base de données à utiliser
 synchronize: true, 
    // Synchronise automatiquement les entités avec la base
    //  crée/modifie les tables automatiquement (dangereux en production)
 logging: false, 
    // Active ou désactive les logs SQL
    // false = aucun log (mettre true ou ["query","error"] pour debug)
 entities: ["src/entity/*.js"] 
    // Chemin vers les entités (modèles)
    //  en dev avec TypeScript → utiliser .ts ou *.{ts,js}
})
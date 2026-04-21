import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppDataSource } from './config/data-source.js';
import authRoutes from './routes/authRoute.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

export default app;
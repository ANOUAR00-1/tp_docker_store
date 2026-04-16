import express from 'express';
import commandRoutes from './routes/commandRoutes.js';

const app = express();

app.use(express.json());

// Routes
app.use('/api/commands', commandRoutes);

export default app;
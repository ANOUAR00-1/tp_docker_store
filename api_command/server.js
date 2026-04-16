import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
 app.listen(PORT, () => {
  console.log(`🚀 Commands Service running on port ${PORT}`);
 });
});
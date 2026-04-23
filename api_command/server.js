import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import { listenToValidationResponses } from './src/controller/commandController.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
 app.listen(PORT, () => {
  console.log(`🚀 Commands Service running on port ${PORT}`);
 });
 
 listenToValidationResponses().catch(console.error);

});
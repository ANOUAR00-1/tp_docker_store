import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
const MONGO_URI = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

const connectDB = async () => {
 try {
  await mongoose.connect(MONGO_URI);
  console.log('Commands Service: MongoDB Connected...');
 } catch (err) {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1);
 }
};

export default connectDB;
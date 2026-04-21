import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
 try {
  const { username, email, password } = req.body;
  const repo = AppDataSource.getRepository(User);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = repo.create({ username, email, password: hashedPassword });

  await repo.save(user);
  res.status(201).json({ message: "User registered successfully" });
 } catch (error) {
  res.status(400).json({ error: error.message });
 }
};

export const login = async (req, res) => {
 try {
  const { email, password } = req.body;
  const repo = AppDataSource.getRepository(User);

  const user = await repo.findOneBy({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
   return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};


// verifyToken
export const verifyToken = (req, res, next) => {
 const authHeader = req.headers['authorization'];
 const token = authHeader && authHeader.split(' ')[1];
 if (!token) return res.status(401).send("Unauthorized");

 try {
  jwt.verify(token, process.env.JWT_SECRET);
  next();
 } catch (err) {
  return res.status(403).send("Forbidden");
 }
};